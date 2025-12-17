const path = require('path');
const fs = require('fs');
const natural = require('natural');

const Entry = require('../models/Entry');
const History = require('../models/History');

const MODEL_DIR = path.join(__dirname, '..', 'sentiment');
const MODEL_PATH = path.join(MODEL_DIR, 'model.json');

let classifier = null;

function moodToLabel(mood) {
    if (!mood) return 'neutral';
    const m = mood.toLowerCase();
    const positive = ['happy', 'calm', 'excited', 'relaxed', 'content'];
    const negative = ['sad', 'anxious', 'angry', 'frustrated', 'depressed'];
    if (positive.includes(m)) return 'positive';
    if (negative.includes(m)) return 'negative';
    return 'neutral';
}

function ensureModelDir() {
    if (!fs.existsSync(MODEL_DIR)) fs.mkdirSync(MODEL_DIR, { recursive: true });
}

function loadClassifier() {
    if (classifier) return classifier;
    ensureModelDir();
    if (fs.existsSync(MODEL_PATH)) {
        try {
            console.log('sentimentService - loading classifier from', MODEL_PATH);
            const raw = fs.readFileSync(MODEL_PATH, 'utf8');
            const obj = JSON.parse(raw);
            classifier = natural.BayesClassifier.restore(obj);
            console.log('sentimentService - classifier loaded');
            return classifier;
        } catch (err) {
            console.warn('Failed to load classifier, will re-train:', err.message);
        }
    }
    console.log('sentimentService - creating new empty classifier');
    classifier = new natural.BayesClassifier();
    return classifier;
}

async function trainFromData(options = { save: true, minExamples: 5 }) {
    console.log('sentimentService - trainFromData start');
    const cls = loadClassifier();
    // Clear existing classifier (start fresh)
    classifier = new natural.BayesClassifier();

    // Use Entry.journalText labeled by mood when available
    const entries = await Entry.find({ journalText: { $exists: true, $ne: '' }, mood: { $exists: true, $ne: '' } }).lean();
    let added = 0;
    entries.forEach(e => {
        const label = moodToLabel(e.mood);
        const text = e.journalText && e.journalText.toString().trim();
        if (text && label) {
            classifier.addDocument(text, label);
            added++;
        }
    });

    // Also use History entries where type indicates feedback/journal and data.text exists
    const histories = await History.find({ type: { $in: ['feedback', 'journal'] }, 'data.text': { $exists: true, $ne: '' } }).lean();
    histories.forEach(h => {
        const text = (h.data && h.data.text) ? h.data.text.toString().trim() : null;
        let label = null;
        if (h.data && h.data.mood) label = moodToLabel(h.data.mood);
        // fallback to rating if present
        if (!label && h.data && typeof h.data.rating === 'number') {
            label = h.data.rating >= 4 ? 'positive' : (h.data.rating <= 2 ? 'negative' : 'neutral');
        }
        if (text && label) {
            classifier.addDocument(text, label);
            added++;
        }
    });

    if (added < options.minExamples) {
        console.log('sentimentService - not enough examples to train:', added);
        return { success: false, message: `Not enough labeled examples (${added}). Add more Entry or History records.` };
    }

    classifier.train();

    console.log('sentimentService - training complete, examples:', added);

    if (options.save) {
        ensureModelDir();
        fs.writeFileSync(MODEL_PATH, JSON.stringify(classifier));
        console.log('sentimentService - saved model to', MODEL_PATH);
    }

    return { success: true, trainedExamples: added };
}

function predict(text) {
    if (!text) return { label: 'neutral', confidences: [] };
    const cls = loadClassifier();
    if (!cls) return { label: 'neutral', confidences: [] };
    try {
        const label = cls.classify(text);
        const confidences = cls.getClassifications(text).map(c => ({ label: c.label, value: c.value }));
        console.log('sentimentService - predict', { textSample: text.slice(0, 80), label });
        return { label, confidences };
    } catch (err) {
        console.error('sentimentService - predict error', err);
        return { label: 'neutral', confidences: [] };
    }
}

module.exports = {
    loadClassifier,
    trainFromData,
    predict,
    MODEL_PATH,
};

const fs = require('fs');
const path = require('path');
const natural = require('natural');

const MODEL_DIR = path.join(__dirname, '..', 'sentiment');
const MODEL_PATH = path.join(MODEL_DIR, 'model.json');

function ensureModelDir() {
    if (!fs.existsSync(MODEL_DIR)) fs.mkdirSync(MODEL_DIR, { recursive: true });
}

async function run() {
    const classifier = new natural.BayesClassifier();

    // Small seeded examples
    const examples = [
        { text: 'I feel fantastic and happy today', label: 'positive' },
        { text: 'I am so grateful and content', label: 'positive' },
        { text: 'This made me smile and relax', label: 'positive' },

        { text: 'I am sad and depressed', label: 'negative' },
        { text: 'Feeling anxious and stressed out', label: 'negative' },
        { text: 'I am angry and upset', label: 'negative' },

        { text: 'It was an ordinary day', label: 'neutral' },
        { text: 'I went to work and did chores', label: 'neutral' },
        { text: 'No strong feelings either way', label: 'neutral' }
    ];

    examples.forEach(e => classifier.addDocument(e.text, e.label));
    classifier.train();

    ensureModelDir();
    fs.writeFileSync(MODEL_PATH, JSON.stringify(classifier));
    console.log('Seed model trained and saved to', MODEL_PATH);
}

run().catch(err => {
    console.error('Seeding failed', err);
    process.exit(1);
});

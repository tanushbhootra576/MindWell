import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import jsPDF from 'jspdf';

const DataExport = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleExportPDF = async () => {
        setLoading(true);
        try {
            // Fetch all user data
            // For now, we'll just use mock data or what we can get
            // const historyRes = await axios.get('http://localhost:5000/api/history');

            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("MindWell User Report", 20, 20);

            doc.setFontSize(12);
            doc.text(`User: ${currentUser.displayName || currentUser.email}`, 20, 30);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

            doc.text("Summary:", 20, 50);
            doc.text("- Coins Earned: 150", 20, 60); // Mock
            doc.text("- Check-ins: 12", 20, 70); // Mock
            doc.text("- Games Played: 5", 20, 80); // Mock

            doc.save("mindwell-report.pdf");
        } catch (error) {
            console.error("Export failed", error);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="header">
                <h2>Data Export</h2>
            </div>
            <div className="card">
                <h3>Download Your Data</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Get a comprehensive report of your mental wellness journey, including mood history, game stats, and journal entries.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={handleExportPDF} className="btn btn-primary" disabled={loading}>
                        {loading ? 'Generating...' : 'Download PDF Report'}
                    </button>
                    <button className="btn btn-secondary" disabled>
                        Download CSV (Coming Soon)
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default DataExport;

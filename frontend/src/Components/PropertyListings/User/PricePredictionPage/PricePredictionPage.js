import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    FaMoneyBillWave,
    FaCalendar,
    FaMapMarkerAlt,
    FaBuilding,
    FaRulerCombined,
    FaChartLine,
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle,
    FaFileAlt
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './PricePredictionPage.css';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';// This automatically extends jsPDF with autoTable


Chart.register(...registerables);

function PricePredictionPage() {
    const location = useLocation();
    const [predictionData, setPredictionData] = useState(null);
    const [propertyPrice, setPropertyPrice] = useState(null);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('insights');

    useEffect(() => {
        const { state } = location;
        if (state && state.predictionData) {
            console.log('Received predictionData:', state.predictionData);
            setPredictionData(state.predictionData);

            if (!state.predictionData.propertyPrice && state.predictionData.propertyId) {
                fetchPropertyPrice(state.predictionData.propertyId);
            } else {
                setPropertyPrice(state.predictionData.propertyPrice);
            }
        } else {
            console.error('No predictionData in location.state');
            setError('No prediction data available');
        }
    }, [location]);

    const fetchPropertyPrice = async (propertyId) => {
        try {
            const response = await fetch(`http://localhost:8070/api/property/${propertyId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch property');
            }
            const property = await response.json();
            console.log('Fetched property:', property);
            setPropertyPrice(property.price || 0);
        } catch (err) {
            console.error('Error fetching property price:', err);
            setError('Failed to load property price');
            setPropertyPrice(0);
        }
    };

    if (error) {
        return (
            <div className="error-container">
                <p className="error-text">
                    <FaExclamationTriangle className="inline-block mr-2" />
                    {error}
                </p>
            </div>
        );
    }

    if (!predictionData || !predictionData.predictions || !predictionData.financialSummary) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <svg className="loading-icon animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m15.357 2h.582M9 20l2.143-2.143M22.83 14a8.002 8.002 0 00-1.94-9.857m1.65-.343L21.43 11m-6 6l-2.143 2.143m2.643-.343l-1.65.343m0 0a8.003 8.003 0 00-9.136-1.94c-.235.083-.48.166-.732.249m2.643-.343L6.57 8.57m14.686 6.287A7.995 7.995 0 0115.3 13m-3-3L5.143 7.143m13.37 9.857l-1.65-.343M16 16l-2.143-2.143" />
                    </svg>
                    <p className="loading-text">Fetching Prediction Data...</p>
                </div>
            </div>
        );
    }

    const getValueColor = (index) => {
        const colors = [
            'value-color-1',
            'value-color-2',
            'value-color-3',
            'value-color-4',
            'value-color-5'
        ];
        return colors[index % colors.length];
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        const contentArea = document.getElementById('prediction-content-area');
        if (contentArea) {
            contentArea.scrollTop = 0;
        }
    };

    const generateOverallReport = () => {
        const doc = new jsPDF();
        // Register autoTable with the jsPDF instance
        autoTable(doc, { /* optional global defaults */ });
    
        doc.setFontSize(18);
        doc.text('Property Price Prediction Report', 10, 10);
        doc.setFontSize(12);
        let y = 30;
    
        // Property Insights Section
        doc.text('Property Insights', 10, y);
        y += 10;
        const insightsData = [
            ['Current Price', predictionData ? `LKR ${predictionData?.property.price.toLocaleString()}` : 'N/A'],
            ['Prediction Date', predictionData?.property.createdAt || 'N/A'],
            ['Location', predictionData?.property.address || 'N/A'],
            ['Property Type', predictionData?.property.type || 'N/A'],
        ];
        autoTable(doc,{ head: [['Detail', 'Value']], body: insightsData, startY: y });
        y = doc.lastAutoTable.finalY + 10;
    
        // Price Projection Section
        doc.text('Price Projection', 10, y);
        y += 10;
        const projectionHeaders = ['Year', 'Estimated Value', 'Confidence'];
        const projectionBody = (predictionData?.predictions || []).map(p => [
            p.year,
            `LKR ${p.estimatedValue?.toLocaleString() || 'N/A'}`,
            p.confidenceScore ? `${Math.round(p.confidenceScore*100)}%` : 'N/A',
        ]);
        autoTable(doc,{ head: [projectionHeaders], body: projectionBody, startY: y });
        y = doc.lastAutoTable.finalY + 10;
    
        // Financial Analysis Section
        doc.text('Financial Analysis', 10, y);
        y += 10;
        doc.text('Benefits:', 10, y);
        y += 5;
        (predictionData?.financialSummary?.benefits || []).forEach(benefit => {
            doc.text(`- ${benefit}`, 15, y);
            y += 5;
        });
        y += 5;
        doc.text('Risks:', 10, y);
        y += 5;
        (predictionData?.financialSummary?.risks || []).forEach(risk => {
            doc.text(`- ${risk}`, 15, y);
            y += 5;
        });
    
        doc.save('property_prediction_report.pdf');
    };

    const chartData = {
        labels: predictionData?.predictions?.map(p => p.year) || [],
        datasets: [
            {
                label: 'Estimated Price (LKR)',
                data: predictionData?.predictions?.map(p => p.estimatedValue) || [],
                fill: false,
                backgroundColor: '#60a5fa',
                borderColor: '#60a5fa',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function (value) {
                        return 'LKR ' + value.toLocaleString();
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += 'LKR ' + context.parsed.y.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div className="prediction-page-container">
            {/* Overall Report Button (Top Right) */}
            <div className="overall-report-container">
                <button className="overall-report-button" onClick={generateOverallReport}>
                    <FaFileAlt className="mr-2" /> Generate Report
                </button>
            </div>

            {/* Navigation Bar */}
            <nav className="prediction-nav">
                <button
                    className={`nav-button ${activeSection === 'insights' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('insights')}
                >
                    <FaInfoCircle className="mr-2" /> Property Insights
                </button>
                <button
                    className={`nav-button ${activeSection === 'projection' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('projection')}
                >
                    <FaChartLine className="mr-2" /> Price Projection
                </button>
                <button
                    className={`nav-button ${activeSection === 'analysis' ? 'active' : ''}`}
                    onClick={() => handleSectionChange('analysis')}
                >
                    <FaExclamationTriangle className="mr-2" /> Financial Analysis
                </button>
            </nav>

            {/* Content Area */}
            <div id="prediction-content-area" className="prediction-content">
                {activeSection === 'insights' && (
                    <div className="section-card">
                        <div className="card-header">
                            <FaMoneyBillWave className="card-icon" />
                            <h2 className="card-title">Property Insights</h2>
                        </div>
                        <div className="details-list">
                            {[
                                { icon: FaMoneyBillWave, label: 'Current Price', value: `LKR ${(predictionData.property.price || 0)?.toLocaleString()}`, color: 'text-green-600' },
                                { icon: FaCalendar, label: 'Prediction Date', value: predictionData.property.createdAt || 'N/A', color: 'text-purple-600' },
                                { icon: FaMapMarkerAlt, label: 'Location', value: predictionData?.property.address || 'N/A', color: 'text-red-600' },
                                { icon: FaBuilding, label: 'Property Type', value: predictionData?.property.type || 'N/A', color: 'text-indigo-600' },
                                // { icon: FaRulerCombined, label: 'Area', value: predictionData?.areaSqFt ? `${predictionData?.areaSqFt} sq ft` : 'N/A', color: 'text-orange-600' }
                            ].map((item, index) => (
                                <div key={index} className="details-item">
                                    <item.icon className={`item-icon ${item.color}`} />
                                    <div className="item-text">
                                        <span className="item-label">{item.label}:</span>
                                        <span className="item-value">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'projection' && (
                    <div className="section-card">
                        <div className="card-header">
                            <FaChartLine className="card-icon green-icon" />
                            <h2 className="card-title">Price Projection</h2>
                        </div>
                        <div className="projection-table-container">
                            <table className="projection-table">
                                <thead>
                                    <tr className="table-header">
                                        <th className="table-header-cell">Year</th>
                                        <th className="table-header-cell">Estimated Value</th>
                                        <th className="table-header-cell">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(predictionData?.predictions || []).map((prediction, index) => (
                                        <tr key={index} className={`table-row ${getValueColor(index)}`}>
                                            <td className="table-cell font-semibold">{prediction.year}</td>
                                            <td className="table-cell font-bold">LKR {(prediction.estimatedValue || 0)?.toLocaleString()}</td>
                                            <td className="table-cell">
                                                <div className="confidence-bar-bg">
                                                    <div
                                                        className="confidence-bar"
                                                        style={{ width: `${prediction.confidenceScore*100 || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="confidence-score">{prediction.confidenceScore ? `${Math.round(prediction.confidenceScore*100)}%` : 'N/A'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Price Projection Graph */}
                        <div className="price-chart-container">
                            <h2>Future Price Trend</h2>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {activeSection === 'analysis' && (
                    <div className="section-card">
                        <div className="card-header">
                            <FaExclamationTriangle className="card-icon yellow-icon" />
                            <h2 className="card-title">Financial Analysis</h2>
                        </div>
                        <div className="summary-grid">
                            {/* Benefits */}
                            <div className="benefits-section">
                                <h3 className="section-title green-text">
                                    <FaCheckCircle className="section-icon green-icon" /> Benefits
                                </h3>
                                <ul className="summary-list">
                                    {(predictionData?.financialSummary?.benefits || []).map((benefit, index) => (
                                        <li key={index} className="summary-item green-item">{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Risks */}
                            <div className="risks-section">
                                <h3 className="section-title red-text">
                                    <FaExclamationTriangle className="section-icon red-icon" /> Risks
                                </h3>
                                <ul className="summary-list">
                                    {(predictionData?.financialSummary?.risks || []).map((risk, index) => (
                                        <li key={index} className="summary-item red-item">{risk}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PricePredictionPage;
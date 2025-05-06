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
    FaCheckCircle
} from 'react-icons/fa';
import './PricePredictionPage.css'; // Import the CSS file

function PricePredictionPage() {
    const location = useLocation();
    const [predictionData, setPredictionData] = useState(null);
    const [propertyPrice, setPropertyPrice] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { state } = location;
        if (state && state.predictionData) {
            console.log('Received predictionData:', state.predictionData);
            setPredictionData(state.predictionData);

            // Check if propertyPrice is present
            if (!state.predictionData.propertyPrice && state.predictionData.propertyId) {
                // Fetch property price if not included in predictionData
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
                <p className="error-text">{error}</p>
            </div>
        );
    }

    if (!predictionData || !predictionData.predictions || !predictionData.financialSummary) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <svg className="loading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="loading-text">Loading Prediction Data...</p>
                </div>
            </div>
        );
    }

    // Color gradient for estimated values
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

    return (
        <div className="prediction-page">
            <div className="prediction-container">
                {/* Header */}
                <div className="header-card">
                    <h1 className="header-title">Property Price Prediction Analysis</h1>
                </div>

                {/* Property Details and Projection */}
                <div className="details-projection-grid">
                    {/* Property Details Card */}
                    <div className="details-card">
                        <div className="card-header">
                            <FaMoneyBillWave className="card-icon" />
                            <h2 className="card-title">Property Insights</h2>
                        </div>
                        <div className="details-list">
                            {[
                                { 
                                    icon: FaMoneyBillWave, 
                                    label: 'Current Price', 
                                    value: `LKR${(propertyPrice || 0).toLocaleString()}`, 
                                    color: 'text-green-600' 
                                },
                                { 
                                    icon: FaCalendar, 
                                    label: 'Prediction Date', 
                                    value: predictionData.date || '2025-05-06', 
                                    color: 'text-purple-600' 
                                },
                                { 
                                    icon: FaMapMarkerAlt, 
                                    label: 'Location', 
                                    value: predictionData.location || 'Unknown', 
                                    color: 'text-red-600' 
                                },
                                { 
                                    icon: FaBuilding, 
                                    label: 'Property Type', 
                                    value: predictionData.propertyType || 'Unknown', 
                                    color: 'text-indigo-600' 
                                },
                                { 
                                    icon: FaRulerCombined, 
                                    label: 'Area', 
                                    value: predictionData.areaSqFt ? `${predictionData.areaSqFt} sq ft` : 'Unknown', 
                                    color: 'text-orange-600' 
                                }
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

                    {/* Price Projection Card */}
                    <div className="projection-card">
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
                                    {(predictionData.predictions || []).map((prediction, index) => (
                                        <tr key={index} className={`table-row ${getValueColor(index)}`}>
                                            <td className="table-cell font-semibold">{prediction.year}</td>
                                            <td className="table-cell font-bold">LKR{(prediction.estimatedValue || 0).toLocaleString()}</td>
                                            <td className="table-cell">
                                                <div className="confidence-bar-bg">
                                                    <div className="confidence-bar" style={{ width: `${prediction.confidenceScore || 0}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="summary-card">
                    <div className="card-header">
                        <FaExclamationTriangle className="card-icon yellow-icon" />
                        <h2 className="card-title">Financial Analysis</h2>
                    </div>
                    <div className="summary-grid">
                        {/* Benefits */}
                        <div className="benefits-section">
                            <h3 className="section-title green-text">
                                <FaCheckCircle className="section-icon green-icon" />
                                Benefits
                            </h3>
                            <ul className="summary-list">
                                {(predictionData.financialSummary.benefits || []).map((benefit, index) => (
                                    <li key={index} className="summary-item green-item">{benefit}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Risks */}
                        <div className="risks-section">
                            <h3 className="section-title red-text">
                                <FaExclamationTriangle className="section-icon red-icon" />
                                Risks
                            </h3>
                            <ul className="summary-list">
                                {(predictionData.financialSummary.risks || []).map((risk, index) => (
                                    <li key={index} className="summary-item red-item">{risk}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PricePredictionPage;
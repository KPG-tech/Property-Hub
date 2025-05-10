const { GoogleGenerativeAI } = require("@google/generative-ai");
const Property = require('../models/Property');

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCOai4aH09jeMHq18DkumCPi6jpqdqn0ew");

exports.predict = async (req, res) => {
    try {
        const { propertyId, date, location, propertyType, areaSqFt, bedrooms, bathrooms, nearbyInfrastructure } = req.body;

        // Validate required fields
        if (!propertyId ) {
            return res.status(400).json({ message: "Missing required field: propertyId." });
        }

        // Fetch property to get pastPrices
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found." });
        }

        const pastPrices = property.pastPrices;
        if (!pastPrices || pastPrices.length < 5) {
            return res.status(400).json({ message: "Property must have at least 5 years of price history." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct prompt with historical price data
        let prompt = `
        Analyze the following property details and predict the potential financial growth and benefits over the next 5 years based on the provided historical price data. Provide a detailed JSON response that includes:

        Property Details:
        - Historical Prices (LKR, past 5 years): 
            ${pastPrices.map((p) => `${p.year} year${p.year > 1 ? 's' : ''} ago: ${p.price}`).join('\n            ')}
        - Date of Analysis: ${date}
        - Location: ${location}
        - Property Type: ${propertyType}
        - Area (SqFt): ${areaSqFt || "Not specified"}
        `;

        // Conditionally add house-specific details
        if (propertyType.toLowerCase() !== "land" && propertyType.toLowerCase() !== "plot") {
            prompt += `
        - Bedrooms: ${bedrooms || "Not specified"}
        - Bathrooms: ${bathrooms || "Not specified"}
            `;
        }

        prompt += `
        - Nearby Infrastructure: ${nearbyInfrastructure || "Not specified"}

        Analysis Requirements:
        1. Predict the estimated property value for each of the next 5 years based on the historical price trends provided.
        2. Identify key factors influencing property value growth in this location (e.g., development projects, infrastructure improvements, market trends).
        3. Project potential rental income growth over the next 5 years. If the property is land, state that rental income is not applicable.
        4. Calculate the estimated ROI (Return on Investment) over 5 years based on the most recent historical price and predicted values.
        5. Provide a summary of potential financial benefits and risks.
        6. Offer visualization suggestions for the frontend (e.g., line graphs for value and rental income, bar charts for ROI).
        7. Give a confidence score for each prediction.
        8. Predict if there there will be any significant impact on the property value due to environmental factors, like flood risk, sea level rise, or other natural disasters.
        9. Predict any changes in the location's demography that might impact value.
        10. Predict any changes in local tax or regulations that might impact the investment.

        Response Format (JSON):
        {
            "predictions": [
                {
                    "year": ${new Date().getFullYear() + 1},
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": []
                },
                {
                    "year": ${new Date().getFullYear() + 2},
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": []
                },
                {
                    "year": ${new Date().getFullYear() + 3},
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": []
                },
                {
                    "year": ${new Date().getFullYear() + 4},
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": []
                },
                {
                    "year": ${new Date().getFullYear() + 5},
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": []
                }
            ],
            "roi": 0,
            "financialSummary": {
                "benefits": [],
                "risks": []
            },
            "visualizationSuggestions": [],
            "environmentalImpact": [],
            "demographicChanges": [],
            "taxAndRegulationChanges": []
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up response
        text = text.replace(/```json\n/g, '');
        text = text.replace(/```/g, '');
        text = text.trim();

        try {
            const jsonResponse = JSON.parse(text);
            const finalResponse = {
                property,
                ...jsonResponse
            };
            res.json(finalResponse);
        } catch (parseError) {
            console.error("Error parsing Gemini response:", parseError);
            console.error("Gemini response text:", text);
            res.status(500).json({ message: "Error parsing Gemini response.", error: parseError.message });
        }

    } catch (error) {
        console.error("Error in predict function:", error);
        res.status(500).json({ message: 'Error during prediction.', error: error.message });
    }
};
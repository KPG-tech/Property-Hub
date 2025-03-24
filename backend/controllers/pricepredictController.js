const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCOai4aH09jeMHq18DkumCPi6jpqdqn0ew");

exports.predict = async (req, res) => {
    try {
        const { price, date, location, propertyType, areaSqFt, bedrooms, bathrooms, nearbyInfrastructure } = req.body;

        if (!price || !date || !location || !propertyType) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = `
        Analyze the following property details and predict the potential financial growth and benefits over the next 5 years. Provide a detailed JSON response that includes:

        Property Details:
        - Price: LKR: ${price}
        - Date of Purchase: ${date}
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
        1. Predict the estimated property value for each of the next 5 years.
        2. Identify key factors influencing property value growth in this location. (e.g., development projects, infrastructure improvements, market trends)
        3. Project potential rental income growth over the next 5 years. If the property is land, state that rental income is not applicable.
        4. Calculate the estimated ROI (Return on Investment) over 5 years.
        5. Provide a summary of potential financial benefits and risks.
        6. Offer visualizations suggestions for the frontend (e.g., line graphs for value and rental income, bar charts for ROI).
        7. Give a confidence score for each prediction.
        8. Predict if there will be any significant impact on the property value due to environmental factor, like flood risk, sea level rise, or other natural disasters.
        9. Predict any changes in the location's demography that might impact value.
        10. Predict any changes in local tax or regulations that might impact the investment.

        Response Format (JSON):
        {
            "predictions": [
                {
                    "year": 2026,
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": [],
                },
                {
                    "year": 2027,
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": [],
                },
                {
                    "year": 2028,
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": [],
                },
                {
                    "year": 2029,
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": [],
                },
                {
                    "year": 2030,
                    "estimatedValue": 0,
                    "estimatedRentalIncome": 0,
                    "confidenceScore": 0,
                    "valueFactors": [],
                    "rentalFactors": [],
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
            "taxAndRegulationChanges": [],

        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json\n/g, ''); // Remove leading ```json
        text = text.replace(/```/g, ''); // Remove trailing ```
        text = text.trim(); // Trim whitespace

        try {
            const jsonResponse = JSON.parse(text);
            res.json(jsonResponse);
        } catch (parseError) {
            console.error("Error parsing Gemini response:", parseError);
            console.error("Gemini response text:", text); // Log the raw response for debugging
            res.status(500).json({ message: "Error parsing Gemini response.", error: parseError.message });
        }

    } catch (error) {
        console.error("Error in predict function:", error);
        res.status(500).json({ message: 'Error during prediction.', error: error.message });
    }
};
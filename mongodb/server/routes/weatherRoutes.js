// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\routes\weatherRoutes.js

const express = require('express');
const router = express.Router();
const Weather = require("../api/weather");

// GET Request - statically get the weather data from the weather api
router.get("/", async (req, res) => {
    try {
        const { zipCode } = req.query;
        let weather = new Weather();

        if (zipCode) {
            // If zipCode is provided, get data from MongoDB
            let weatherData = await weather.getWeatherDataFromMongo(zipCode);
            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(weatherData, null, 4));
        } else {
            // Default example for GET request without parameters
            let weatherData = await weather.getWeatherData(98052, "us");
            res.header("Content-Type", 'application/json');
            res.send(JSON.stringify(weatherData, null, 4));
        }
    } catch (error) {
        console.error('Error in GET weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
});

// POST Request - dynamically get the weather data based on request body
router.post("/", async (req, res) => {
    try {
        const { zipCode, tempMetric } = req.body;
        console.log(`Fetching weather for zipCode: ${zipCode}, tempMetric: ${tempMetric}`);
        
        let weather = new Weather();
        let weatherData = await weather.getWeatherData(zipCode, tempMetric);

        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(weatherData, null, 4));
    } catch (error) {
        console.error('Error in POST weather:', error);
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
});

// POST Request - get the weather data from the api, save it to mongo, then return the data back
router.post("/save", async (req, res) => {
    try {
        const { zipCode, tempMetric } = req.body;
        let weather = new Weather();
        let weatherData = await weather.getWeatherData(zipCode, tempMetric);

        await weather.saveWeatherDataToMongo(zipCode, weatherData);
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(weatherData, null, 4));
    } catch (error) {
        console.error('Error in POST weather/save:', error);
        res.status(500).json({ error: 'Failed to save weather data', details: error.message });
    }
});

module.exports = router;
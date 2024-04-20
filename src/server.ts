import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001; // or any other port you prefer

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Read the cities.json file and store it in a variable for future use
let citiesData: any[] = [];
fs.readFile(path.join(__dirname, 'cities.json'), (err, data) => {
    if (err) {
        console.error('Error reading cities.json:', err);
    } else {
        citiesData = JSON.parse(data.toString());
    }
});

// API endpoint to get all cities
app.get('/api/cities', (req: Request, res: Response) => {
    res.json(citiesData);
});

// API endpoint to get weather info by city name
app.get('/api/weather/:cityName', (req: Request, res: Response) => {
    const cityName = req.params.cityName;
    const city = citiesData.find((city) => city.city === cityName);

    if (city) {
        // Generate fake weather data (replace with actual weather API call in production)
        const weatherInfo = {
            temperature: Math.floor(Math.random() * 30) + 1,
            windSpeed: Math.floor(Math.random() * 20) + 1,
            windDirection: ['North', 'East', 'South', 'West'][Math.floor(Math.random() * 4)],
            condition: ['sunny', 'cloudy', 'rain'][Math.floor(Math.random() * 3)]
        };

        res.json(weatherInfo);
    } else {
        res.status(404).json({ error: 'City not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

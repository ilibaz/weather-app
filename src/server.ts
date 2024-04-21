import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import compression from 'compression';

const app = express();
const port = 3001; // or any other port you prefer

app.use(express.json());
app.use(compression());

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

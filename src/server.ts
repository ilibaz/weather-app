import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

var cors = require('cors')
const app = express();
const port = 3001; // or any other port you prefer

app.use(cors())

app.get('/api/cities', (req: Request, res: Response) => {
    // Read the cities.json file
    fs.readFile(path.join(__dirname, 'cities.json'), (err, data) => {
        if (err) {
            // If there's an error reading the file, send a 500 error
            res.status(500).json({ error: 'Error reading cities.json' });
        } else {
            // Otherwise, send the contents of cities.json as the response
            res.json(JSON.parse(data.toString()));
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
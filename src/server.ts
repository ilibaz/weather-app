import express, { Request, Response } from 'express';
var cors = require('cors')

const app = express();
const port = 3001; // or any other port you prefer

app.use(cors())

app.get('/api/data', (req: Request, res: Response) => {
    // Handle your API logic here
    const data = { message: 'Hello from the server!' };
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
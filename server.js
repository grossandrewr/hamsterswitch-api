import express from 'express';
import { makeGPTRequest } from './openai.js';

const app = express();

app.get('/', async (req, res) => {
    try {
        const results = await makeGPTRequest("sounds like the beatles");
        res.send(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
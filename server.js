import express from 'express';
import { makeGPTRequest } from './openai.js';

const app = express();
app.use(express.json());

app.post('/get-albums', async (req, res) => {
  try {
    const inputString = req.body.searchString;
    const { message } = await makeGPTRequest(inputString);
    const content = message.content;
    validateResponse(content)
    res.status(200).json({ data: content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT); 

const validateResponse = content => {
  let contentArray;
  try {
    contentArray = JSON.parse(content);
  } catch (error) {
    throw new Error("Error parsing JSON");
  }

  if (!Array.isArray(contentArray)) {
    throw new Error("Content is not an array");
  } 
  for (const item of contentArray) {
    if (typeof item !== 'object' || !item.hasOwnProperty('album') || !item.hasOwnProperty('artist')) {
      throw new Error("Invalid content format");
    } 
    if (typeof item.album !== 'string' || typeof item.artist !== 'string') {
      throw new Error("Invalid types for album or artist");
    }
  }
}
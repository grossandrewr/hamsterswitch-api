import express from "express";
import cors from "cors";
import { makeGptSearchRequest } from "./openAiRequests.js";
import {
  albumSearchSystemPrompt,
  descriptionSystemPrompt,
} from "./constants.js";
import { validateAlbumsList } from "./utils.js";

const app = express();
app.use(express.json());
app.use(cors());

const handleRequest = async (req, res, systemPrompt, validateFn) => {
  console.log(`Request to ${req.path}`);
  try {
    const inputString = req.body.searchString;
    const {
      message: { content },
    } = await makeGptSearchRequest(systemPrompt, inputString);

    if (validateFn) validateFn(content);

    console.log("Sending 200");
    res.status(200).json(content);
  } catch (error) {
    console.error(`Error processing ${req.path}:`, error);
    res.status(500).send("Internal Server Error");
  }
};

app.post("/get-albums", (req, res) =>
  handleRequest(req, res, albumSearchSystemPrompt, validateAlbumsList),
);
app.post("/get-description", (req, res) =>
  handleRequest(req, res, descriptionSystemPrompt, null),
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

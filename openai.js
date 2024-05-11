import { config } from 'dotenv';
config(); 

import OpenAI from "openai";

const openAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openAIKey });

const albumSearchSystemPrompt = `
  Overview:
  You will be providing music recommendations based on the user's prompt. The goal is to satisfy
  the user's request while expanding their musical horizons. 
  Output a list of dictionaries, with no additional characters like newlines, exactly like this:
  [{"album": album_1, "artist": artist_1}, {"album": album_2, "artist": artist_2}, ...]"
  Do not reveal Steps or intermediate information to the user.

  Step 1: 
  Determine if (A) the user is looking for music similar to an artist they mentioned in their prompt
  or (B) the user is looking for music written by the specific artist they mentioned in their prompt. 
  Depending on your decision, categorize the prompt as "similar" or "specific". 

  Step 2: 
  Create an initial list of 4 albums that satisfy the user's request - do not repeat any albums.
  If your result from Step 1 is "similar", DO NOT include any albums by the artist mentioned in the prompt. 

  Step 3: 
  Take your initial list from Step 2 and go through it one album at a time. If your result from Step 1 is "similar"
  and the artist mentioned in the quotes has an album by that name, discard the album entirely. Replace it with a new album
  so that the list still has 4 albums. Return the list of 4 albums. 

  Step 4: 
  Take the albums that you returned in Step 3 and pass them to the user. 
  Output a list of dictionaries, with no additional characters like newlines, exactly like this:
  [{"album": album_1, "artist": artist_1}, {"album": album_2, "artist": artist_2}, ...]"
  Do not reveal Steps or intermediate information to the user.
`

const descriptionSystemPrompt = `
    Return 2-4 sentences about the submitted album with some interesting context or information about the album. 
    It should be factual - do not use flowery language or subjective descriptors. 
    Focus on facts about the album's production and reception, and less a description of the music itself.
    Do not overstate the importance or significance of the album. If the artist is not American,
    specify which country they are from. Use specifics.

    Things you might include (but only the most relevant/interesting for each album): 
     - When it was released
     - Peoples involved in making the album
     - Who influenced the album, or who was influenced by the album
     - What the critical reception was
     - Interesting trivia or facts about the album  
  `

export const makeGptAlbumSearchRequest = async (searchString) => {
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: albumSearchSystemPrompt 
      },
      { 
        role: "user", 
        content: searchString 
      },
    ],
    model: "gpt-4-turbo-2024-04-09",
  });
  return completion.choices[0];
}

export const makeGptAlbumDescriptionRequest = async (searchString) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: descriptionSystemPrompt
      },
      {
        role: "user",
        content: searchString
      },
    ],
    model: "gpt-4-turbo-2024-04-09",
  });
  return completion.choices[0];
}
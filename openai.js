import { config } from 'dotenv';
config(); 

import OpenAI from "openai";

const openAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openAIKey });

const systemPrompt = `
Overview:
You will be providing music recommendations based on the user's prompt. The goal is to satisfy
the user's request while expanding their musical horizons. 


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
[{"album": album_1, "artist": artist_1, "description": description_1}, {"album": album_2, "artist": artist_2, "description": description_2}, ...]"
Do not reveal Steps or intermediate information to the user.
The "description" field should be 3-6 sentences with some interesting context or information about
the album. It should be factual - do not use flowery language or subjective descriptors.
Focus on facts about the album's production and reception - for example, when it was released, who featured on it, 
what the critical reception was, and less a description of the music itself. If the artist is not American,
specify which country they are from. If there are any interesting factoids
about the album that don't fall into those categories, feel free to include. Use SPECIFICS - if you have any direct
quotes from critics about the album, feel free to use those. 
`

export const makeGPTRequest = async (searchString) => {
    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: systemPrompt 
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

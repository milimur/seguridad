const express = require('express');
const dotenv = require('dotenv');
const { google } = require('googleapis');
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.API_KEY;

const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

//use: http://localhost:$PORT/search?search_query=foo

app.get("/search", async (req, res, next) => {
    try {
        const searchQuery = req.query.search_query.trim().toLowerCase();

        // Validate the search query
        if (!searchQuery) {
            return res.status(400).json({ error: 'El parámetro "search_query" es requerido y no puede estar vacío.' });
        }
        
        //Perform the search using the YouTube API from googleapis
        const response = await youtube.search.list({
            part: "snippet",
            q: searchQuery,
            type: "video",  
            maxResults: 2,
        });
        
        res.json(response.data);
    } catch (err) {
        next(err); 
    }
});

app.get("/channels", async (req, res, next) => {
    try {
        const searchQuery = req.query.channel?.trim().toLowerCase();

        // Validate the search query
        if (!searchQuery) {
            return res.status(400).json({ error: 'El parámetro "search_query" es requerido y no puede estar vacío.' });
        }
        
        // Perform the search using the YouTube API from googleapis
        const response = await youtube.search.list({
            part: "snippet",
            q: searchQuery,
            type: "channel",  // Set type to "channel"
            maxResults: 4,
        });
        
        res.json(response.data);
    } catch (err) {
        next(err); 
    }
});

//http://localhost:3000/comments?videoId=HL3oCZXFoVs
app.get("/comments", async (req, res, next) => {
    try {
        const videoId = req.query.videoId?.trim();

        // Validate the videoId
        if (!videoId) {
            return res.status(400).json({ error: 'El parámetro "videoId" es requerido y no puede estar vacío.' });
        }

        // Perform the API call to retrieve comment threads
        const response = await youtube.commentThreads.list({
            part: "snippet,replies", 
            videoId: videoId,  
            maxResults: 5,  
        });

        res.json(response.data);
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`App escuchando en http://localhost:${port}`);
});

module.exports = app;
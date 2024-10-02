const express = require('express');
const dotenv = require('dotenv');
const { google } = require('googleapis');
dotenv.config();
const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

//use: http://localhost:3000/search?search_query=foo

app.get("/search", async (req, res, next) => {
    try {
        const searchQuery = req.query.search_query;
        if (!searchQuery) {
            return res.status(400).json({ error: 'El parámetro "search_query" es requerido.' });
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

app.listen(port, () => {
    console.log(`App escuchando en http://localhost:${port}`);
});

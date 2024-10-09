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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Search videos
async function searchYouTube(searchQuery) {
    const response = await youtube.search.list({
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 2,
    });
    return response.data;
}

// Define the /search route
app.get("/search", async (req, res, next) => {
    try {
        const searchQuery = req.query.search_query?.trim().toLowerCase();

        // Validate the search query
        if (!searchQuery) {
            return res.status(400).json({ error: 'El parámetro "search_query" es requerido y no puede estar vacío.' });
        }

        // Call the YouTube search function
        const data = await searchYouTube(searchQuery);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Search channels
async function searchYouTubeChannels(searchQuery) {
    const response = await youtube.search.list({
        part: "snippet",
        q: searchQuery,
        type: "channel",
        maxResults: 4,
    });
    return response.data;
}

// Define the /channels route
app.get("/channels", async (req, res, next) => {
    try {
        const searchQuery = req.query.channel?.trim().toLowerCase();

        // Validate the search query
        if (!searchQuery) {
            return res.status(400).json({ error: 'El parámetro "channel" es requerido y no puede estar vacío.' });
        }

        // Call the YouTube search function
        const data = await searchYouTubeChannels(searchQuery);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

async function getYouTubeComments(videoId) {
    const response = await youtube.commentThreads.list({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: 5,
    });
    return response.data;
}

// Define the /comments route
app.get('/comments', async (req, res, next) => {
    try {
        const videoId = req.query.videoId?.trim();

        // Validate the videoId
        if (!videoId) {
            return res.status(400).json({ error: 'El parámetro "videoId" es requerido y no puede estar vacío.' });
        }

        // Call the YouTube comments function
        const data = await getYouTubeComments(videoId);
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Export the functions and app for testing
module.exports = { searchYouTube, searchYouTubeChannels, getYouTubeComments};
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/characterList', async (req, res) => {
    try {
        const { query } = req.query;
        const url = `https://sc2pulse.nephest.com/sc2/api/characters?query=${query}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching SC2 characters');
        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing SC2 characters response data');

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Error fetching Characters List. Details: ${error.message}` });
    }
});

app.get('/api/characterDetails', async (req, res) => {
    try {
        const { characterId } = req.query;

        const url = `https://sc2pulse.nephest.com/sc2/api/characters?characterId=${characterId}`;
        const response = await fetch(url);
        if (!response || !response.ok) throw new Error('Error fetching Character details');

        const data = await response.json();
        if (!data) throw new Error('Error parsing response data');

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch Character data ${error.message}` });
    }
})

app.get('/api/matches', async (req, res) => {
    try {
        const { characterId } = req.query;
        if (!characterId) {
            return res.status(400).json({ error: 'characterId is required' });
        }

        const targetUrl = `https://sc2pulse.nephest.com/sc2/api/character-matches?characterId=${characterId}&type=_1V1`;
        const response = await fetch(targetUrl);
        if (!response || !response.ok) throw new Error('Error fetching SC2 Pulse Match History data');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch SC2 Pulse Match History data. Details: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
})
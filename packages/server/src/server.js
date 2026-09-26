import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 3000;
const SC2PULSE_API_BASE_URL = process.env.SC2PULSE_API_URL || 'https://sc2pulse.nephest.com/sc2/api';

app.use(cors());

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
})

app.get('/api/character-teams', async (req, res) => {
    try {
        const { characterId, seasonId } = req.query;
        const url = `${SC2PULSE_API_BASE_URL}/character-teams?characterId=${characterId}&season=${seasonId}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching character stats');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing result data from character stats');

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Error fetching character stats data. Details: ${error.message}` });
    }
});

app.get('/api/seasons', async (req, res) => {
    try {
        const url = `${SC2PULSE_API_BASE_URL}/seasons`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching seasons');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing result data from Seasons');

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Error fetching Seasons data. Details: ${error.message}` });
    }
});

app.get('/api/characterList', async (req, res) => {
    try {
        const { query } = req.query;
        const url = `${SC2PULSE_API_BASE_URL}/characters?query=${query}`;

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

        const url = `${SC2PULSE_API_BASE_URL}/characters?characterId=${characterId}`;
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

        const targetUrl = `${SC2PULSE_API_BASE_URL}/character-matches?characterId=${characterId}&type=_1V1`;
        const response = await fetch(targetUrl);
        if (!response || !response.ok) throw new Error('Error fetching SC2 Pulse Match History data');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch SC2 Pulse Match History data. Details: ${error.message}` });
    }
});

/**
 * GET /api/team-histories
 *
 * Proxies SC2Pulse's /api/team-histories endpoint, requesting all 4 race
 * variants (Terran//Protoss/Zerg/Random) for a single character in one call.
 *
 * @param {string} req.query.characterId - Battle.net character ID, e.g. "13968281".
 * @param {string} req.query.regionId - Region ID: 1=US, 2=EU, 3=KR/TW, 5=CN.
 */
app.get('/api/team-histories', async (req, res) => {
    const { battlenetId, regionId, realm } = req.query;

    const TEAM_TYPE = {
        ARRANGED: 0, // premade/solo — always this for 1v1
        RANDOM: 1,   // teammates matched randomly — 2v2+ only
    };

    const params = new URLSearchParams();
    [1, 2, 3, 4].forEach(race => {
        params.append('teamLegacyUid', `201-${TEAM_TYPE.ARRANGED}-${regionId}-${realm}.${battlenetId}.${race}`);
    });

    params.append('history', 'TIMESTAMP');
    params.append('history', 'RATING');

    const url = `${SC2PULSE_API_BASE_URL}/team-histories?${params}`;

    try {
        const response = await fetch(url);
        if (!response || !response.ok) {
            throw new Error(`Error fetching Team Histories data. ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data) throw new Error(`Error parsing Team Histories data ${response.status} ${response.statusText}`);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch SC2 Team Histories data. Details: ${error.message}` });
    }
});
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express()
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const API_URL = 'https://euw1.api.riotgames.com';
const USERNAME = 'ivanyoo';

let ENCRYPTED_SUMMONER_ID = '';
let ENCRYPTED_ACCOUNT_ID = '';

const requestRiotApi = async (queryURL, query) => {
    try {
        const response = await axios.get(`${API_URL}${queryURL}${query}`, {
        headers: {
            'X-Riot-Token': RIOT_API_KEY
        }
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

const initialRequest = async () => {
    const summonerQuery = '/lol/summoner/v4/summoners/by-name/';
    const riotResponse = await requestRiotApi(summonerQuery, USERNAME);
    ENCRYPTED_SUMMONER_ID = riotResponse && riotResponse.id;
    ENCRYPTED_ACCOUNT_ID = riotResponse && riotResponse.accountId;
};

(async () => {
    try {
        await initialRequest();
    } catch (error) {
        console.log('Initial request failed - closing server', error);
        process.exit();
    }
})();

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/summoner', async (req, res) => {
    const summonerQuery = '/lol/summoner/v4/summoners/by-name/';
    const riotResponse = await requestRiotApi(summonerQuery, USERNAME);
    res.json(riotResponse);
});

app.get('/ranked-stats', async (req, res) => {
    const rankedStatsQuery = '/lol/league/v4/entries/by-summoner/';
    const riotResponse = await requestRiotApi(rankedStatsQuery, ENCRYPTED_SUMMONER_ID);
    res.json(riotResponse);
});

app.get('/champion-mastery', async (req, res) => {
    const championMasteryURL = '/lol/champion-mastery/v4/champion-masteries/by-summoner/';
    const riotResponse = await requestRiotApi(championMasteryURL, ENCRYPTED_SUMMONER_ID);
    res.json(riotResponse);
});

app.get('/match-list', async (req, res) => {
    const matchListURL = '/lol/match/v4/matchlists/by-account/';
    const riotResponse = await requestRiotApi(matchListURL, ENCRYPTED_ACCOUNT_ID);
    res.json(riotResponse);
});

app.listen(3000);
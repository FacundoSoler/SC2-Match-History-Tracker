import { Realm } from "../models/realms";
import { Region } from "../models/regions";
import { SeasonDetails } from "../models/seasonDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function searchCharactersByName(searchParam: string) {
    try {
        if (!searchParam) return;

        const url = `${API_BASE_URL}/characterList?query=${searchParam}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching SC2 characters');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing SC2 characters response data');

        return data;
    } catch (error: any) {
        throw new Error(`Error fetching server API SC2 Pulse Match History', ${error.message}`);
    }
}

export async function loadCharacterDetails(characterId: number) {
    const url = `${API_BASE_URL}/characterDetails?characterId=${characterId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    let data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data[0];
}

export async function loadCharacterTeamsData(characterId: number, seasonId: number) {
    const url = `${API_BASE_URL}/character-teams?characterId=${characterId}&seasonId=${seasonId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data;
}

export async function loadMatchHistory(characterId: number) {
    const url = `${API_BASE_URL}/matches?characterId=${characterId}`;

    const response = await fetch(url);
    if (!response || !response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!data.result && !Array.isArray(data.result)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data;
}

export async function loadCharacterTeamHistories(battlenetId: number, regionId: Region, realm: number) {
    const url = `${API_BASE_URL}/team-histories?battlenetId=${battlenetId}&regionId=${regionId}&realm=${realm}`;

    const response = await fetch(url);
    if (!response || !response.ok) throw new Error('Failed to fetch SC2 Pulse Team Histories data.');

    const data = await response.json();
    return data;
}

export async function loadMaxRatingsPerRace(battlenetId: number, regionId: Region, realm: number) {
    const url = `${API_BASE_URL}/team-histories?battlenetId=${battlenetId}&regionId=${regionId}&realm=${realm}`;

    const response = await fetch(url);
    if (!response || !response.ok) throw new Error('Failed to fetch SC2 Pulse Team Histories data.');

    const data = await response.json();

    const mappedData = data.map((raceHistory: any) => {
        const mappedResults = raceHistory.history.RATING.map((rating: any, i: any) => ({
            RatingSet: {
                rating,
                timestamp: raceHistory.history.TIMESTAMP[i]
            }
        }));

        const sortedResults = mappedResults?.sort((a: any, b: any) => {
            return b.RatingSet.rating - a.RatingSet.rating
        });

        return {
            ...raceHistory.staticData,
            history : sortedResults
        };
    });

    return mappedData;
}

export async function getCurrentSeason(): Promise<number | undefined> {
    try {
        const url = `${API_BASE_URL}/seasons`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching Seasons data');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing Seasons data');

        const seasonDetails: SeasonDetails[] = data;
        const sortedData = seasonDetails.sort((a, b) => b.battlenetId - a.battlenetId)[0]?.battlenetId;

        return sortedData;

    } catch (error: any) {
        console.error(error);
        return undefined;
    }
} 
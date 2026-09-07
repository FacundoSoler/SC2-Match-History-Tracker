<template>
    <form @submit.prevent="search()">
        <div class="characterSearch-main-container">
            <div>
                <title>SC2 Match History Tracker</title>
            </div>

            <h2 style="text-align: center;">SC2 Match History Tracker</h2>

            <div>
                <div class="searchBar">  
                    <label for="">BattleNet profile Link:</label>
                    <v-text-field width="200px" v-model="battleNetProfile" placeholder="name, btag#123, [cLaN],"
                        variant="outlined" density="compact" hide-details color="#0d6efd"
                        class="sc2-search-input"></v-text-field>
                    <v-btn type="submit" color="#0d6efd" class="sc2-search-btn" height="40" elevation="0"
                        :loading="isLoading">Search
                    </v-btn>
                </div>
                <div v-show="!isLoading && characterList" class="characterSearchResults">
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <td>Region</td>
                                    <td>Best 1v1 League</td>
                                    <td>Best 1v1 MMR</td>
                                    <td>Total 1v1 Games</td>
                                    <td>Last 1v1 MMR</td>
                                    <td>Last 1v1 Games</td>
                                    <td>Player</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="character in characterList">
                                    <td><img :src="setRegionIcon(character.members.character.region)" width="22px">
                                    </td>
                                    <td><img :src="setLeagueIcon(character.leagueMax)" width="20px">
                                    </td>
                                    <td>{{ character.ratingMax }}</td>
                                    <td>{{ character.totalGamesPlayed }}</td>
                                    <td>{{ character.currentStats.rating }}</td>
                                    <td>{{ character.currentStats.gamesPlayed }}</td>
                                    <td>
                                        <router-link style="display: flex; align-items: center; gap: 6px;"
                                            class="matchHistoryLink" :to="{
                                                name: 'matches',
                                                params: { characterId: character.members.character.id, seasonId: currentSeason }
                                            }">
                                            <span style="display: flex;">
                                                <img style="width: 12px;"
                                                    :src="getRaceIconLink(character.members.raceGames)" width="15px">
                                            </span>
                                            <span>
                                                {{ character.members.character.tag }} | {{
                                                    character.members.account.battleTag
                                                }}
                                            </span>
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </form>

</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SeasonDetails } from '../models/seasonDetails';
import { getRaceIconLink } from '../utils/assetsHelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

defineOptions({ name: "CharacterSearch" });

let isLoading = ref(false);
const battleNetProfile = ref('');
const characterList = ref<any>(null);
let currentSeason = ref(0);

onMounted(async () => {
    await getSeasons();
});

async function getSeasons() {
    try {
        const url = `${API_BASE_URL}/seasons`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching Seasons data');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing Seasons data');

        const seasonDetails: SeasonDetails[] = data;
        currentSeason.value = seasonDetails.sort((a, b) => b.battlenetId - a.battlenetId)[0]?.battlenetId;

    } catch (error: any) {
        console.error(error);
    }
}

async function search() {
    try {
        isLoading.value = true;

        if (!battleNetProfile.value) return;

        const url = `${API_BASE_URL}/characterList?query=${battleNetProfile.value}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching SC2 characters');

        const data = await response.json();
        if (!data || !Array.isArray(data)) throw new Error('Error parsing SC2 characters response data');

        characterList.value = data;
        console.log('characterList', characterList);

    } catch (error) {
        console.error('Error fetching server API SC2 Pulse Match History', error);
    } finally {
        isLoading.value = false;
    }
}

function setRegionIcon(region: string | null | undefined) {
    if (!region) return;

    if (region === "US") return "/assets/region_us.svg";
    if (region === "EU") return "/assets/region_eu.svg";
    if (region === "KR") return "/assets/region_kr.svg";
}

function setMatchHistoryLink(characterId: number) {
    const url = `${API_BASE_URL}/matches?characterId=${characterId}`;
    return url;
}

function setLeagueIcon(leagueMax: number) {
    if (leagueMax === 0) return "/assets/league_bronze.svg";
    if (leagueMax === 1) return "/assets/league_silver.svg";
    if (leagueMax === 2) return "/assets/league_gold.svg";
    if (leagueMax === 3) return "/assets/league_platinum.svg";
    if (leagueMax === 4) return "/assets/league_diamond.svg";
    if (leagueMax === 5) return "/assets/league_master.svg";
    if (leagueMax === 6) return "/assets/league_grandmaster.svg";
}

</script>
<style>
html {
    background-color: rgba(9, 9, 12, 0.904);
    color: rgb(191, 192, 192);
}

.characterSearch-main-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.searchBar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.sc2-search-input {
    width: 320px;
    flex-grow: 0;
    margin: 0 5px 0 10px;
}

:deep(.sc2-search-input .v-field) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

:deep(.sc2-search-input .v-field--focused) {
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.4);
}

.sc2-search-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    text-transform: none;
    font-size: 16px;
    letter-spacing: normal;
}

.characterSearchResults {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.matchHistoryLink {
    color: #0ca2f9;
}

table {
    border-collapse: separate;
    border-spacing: 20px 8px;
}

th,
td {
    padding: 4px 16px;
    text-align: left;
}

thead td {
    font-weight: bold;
    border-bottom: 1px solid;
}
</style>
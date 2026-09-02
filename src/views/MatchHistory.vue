<template>
    <!-- <router-link class="backButton" to="/">← Go Back to Character Search</router-link> -->

    <router-link to="/" class="back-link">
        <v-icon icon="mdi-arrow-left" size="18" class="back-icon" />
        <span>Character Search</span>
    </router-link>

    <!-- <router-link to="/" class="back-link">
        <span class="back-arrow" aria-hidden="true">←</span>
        <span>Character Search</span>
    </router-link> -->
    <div v-if="!isLoading" class="main-content">
        <div class="panels">
            <div class="stats">
                <h1 class="panel-title">Character Stats</h1>
                <div class="characterDetailsSection">
                    <table>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Account</td>
                                <td>Region</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ charDetails.Name }}</td>
                                <td>{{ charDetails.Account }}</td>
                                <td>
                                    {{ charDetails.Region }} -
                                    <img src="/assets/region_us.svg" width="22px">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="raceStats">
                    <table>
                        <caption>Last 20 matches</caption>
                        <thead>
                            <tr>
                                <td>Vs.</td>
                                <td><img :src="setRaceIcon('Protoss')" width="15px"></td>
                                <td><img :src="setRaceIcon('Zerg')" width="20px"></td>
                                <td><img :src="setRaceIcon('Terran')" width="25px"></td>
                                <td><img :src="setRaceIcon('Random')" width="20px"></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>{{ stats.Protoss }}</td>
                                <td>{{ stats.Zerg }}</td>
                                <td>{{ stats.Terran }}</td>
                                <td>{{ stats.Random }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="winrate-block">
                    <div class="winrate-title">Win rate</div>

                    <v-progress-circular :model-value="currentWinRate" :size="150" :width="15" color="primary">
                        <div class="winrate-inner">
                            <span class="winrate-value">{{ currentWinRate }}</span>
                            <span class="winrate-sub">%</span>
                        </div>
                    </v-progress-circular>
                </div>

            </div>
            <div class="matchHistory">
                <div v-if="parsedData && parsedData.matches" class="matchHistoryList">
                    <h1 class="panel-title">Match History</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Duration</td>
                                <td>Map Name</td>
                                <td>Outcome</td>
                                <td>Player 1</td>
                                <td>Player 2</td>
                            </tr>
                        </thead>
                        <tbody v-for="match in sortedMatches">
                            <tr>
                                <td>{{ match.duration }}</td>
                                <td>{{ match.map }}</td>
                                <td :class="{
                                    matchWon: match.players[0]?.name === charDetails.Tag
                                        && match.players[0].decision === 'WIN' ||
                                        match.players[1]?.name === charDetails.Tag
                                        && match.players[1].decision === 'WIN',
                                    matchLost: match.players[0]?.name === charDetails.Tag
                                        && match.players[0].decision === 'LOSS' ||
                                        match.players[1]?.name === charDetails.Tag
                                        && match.players[1].decision === 'LOSS'
                                }">{{ setOutcome(match) }}</td>
                                <td><img v-if="match.players[0]" :src="setRaceIcon(match.players[0].race)"
                                        :alt="match.players[0].race" width="16" height="16" />
                                    {{ match.players[0]
                                        ? `${match.players[0]?.name} (${match.players[0]?.mmr}
                                    ${showMMRchange(match.players[0]?.ratingChange)})`
                                        : "-- Unkown player --"
                                    }}</td>
                                <td><img v-if="match.players[1]" :src="setRaceIcon(match.players[1].race)"
                                        :alt="match.players[1].race" width="16" height="16" />
                                    {{ match.players[1]
                                        ? `${match.players[1]?.name} (${match.players[1]?.mmr}
                                    ${showMMRchange(match.players[1]?.ratingChange)})`
                                        : "-- Unkown player --"
                                    }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { characterDetails } from '../models/characterDetails';
import { parsePulseMatches } from '../parsePulseMatches';

const props = defineProps<{
    characterId: string
}>();

const API_BASE_URL = 'http://localhost:3000/api';
let isLoading = ref(true);
const parsedData = ref<any>(null);
const sortedMatches = ref<any>(null);

const charDetails = ref<characterDetails>({
    Name: '',
    Account: '',
    Tag: '',
    Region: ''
});

let stats: Partial<{
    Protoss: string,
    Terran: string,
    Zerg: string,
    Random: string
}> = {};

const targetWinRate = ref(0); // from our API data set
const currentWinRate = ref(0); // the actual value used in our circular progress Component (UI)

onMounted(async () => {
    try {
        isLoading.value = true;
        await loadCharacterDetails(props.characterId);
        await loadMatchHistory(props.characterId);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
        await nextTick();
        requestAnimationFrame(() => {
            animateWinrateCircularProgress();
        })
    }
});

async function animateWinrateCircularProgress() {
    currentWinRate.value = 0;
    const totalSteps = targetWinRate.value;
    if (totalSteps <= 0) return; 

    const timeInterval = 750 / totalSteps;
    const tickTimer = setInterval(() => {
        currentWinRate.value++;
        if (currentWinRate.value >= targetWinRate.value) {
            clearInterval(tickTimer);
        }
    }, timeInterval);
}

async function loadCharacterDetails(characterId: string) {
    const url = `${API_BASE_URL}/characterDetails?characterId=${characterId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    let data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    setCharacterDetails(data[0].members);
}

async function loadMatchHistory(characterId: string) {
    const url = `${API_BASE_URL}/matches?characterId=${characterId}`;

    const response = await fetch(url);
    if (!response || !response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!data.result && !Array.isArray(data.result)) throw new Error('Error parsing SC2 Pulse Match History data');

    parsedData.value = parsePulseMatches(data, { focalName: charDetails.value.Tag });
    console.log('Final parsing data output', parsedData.value);

    // sort matches
    const characterName = parsedData.value.focalPlayer;
    sortedMatches.value = parsedData.value.matches.map((match: any) => ({
        ...match,
        players: [...match.players].sort((a, b) =>
            a.name === characterName ? -1 : b.name === characterName ? 1 : 0
        )
    }));

    console.log('sortedMatches', sortedMatches.value);

    targetWinRate.value = sortedMatches.value[0].players[0].record.percent;
    console.log(sortedMatches.value[0].players[0].record);
    console.log('Winrate', currentWinRate.value);

    setWinsPerRaceStats(parsedData.value.winsVsRace);
}

function setCharacterDetails(memberCharacter: any) {
    charDetails.value.Name = memberCharacter.character.name;
    charDetails.value.Tag = memberCharacter.character.tag;
    charDetails.value.Account = memberCharacter.account.battleTag;
    charDetails.value.Region = memberCharacter.character.region;
}

function setWinsPerRaceStats(winsVsRace: any) {
    stats.Protoss = winsVsRace.Protoss.text;
    stats.Zerg = winsVsRace.Zerg.text;
    stats.Terran = winsVsRace.Terran.text;
    stats.Random = winsVsRace.Random.text;
}

function setRaceIcon(race: string | null | undefined) {
    if (race === "Terran") return "/assets/terran.svg";
    if (race === "Protoss") return "/assets/protoss.svg";
    if (race === "Zerg") return "/assets/zerg.svg";
    return "/assets/random.svg";
}

function showMMRchange(variation: number) {
    if (variation === null) return '';

    if (variation > 0) return `+${variation}`;

    return variation;
}

function setOutcome(match: any) {
    if (match.players[0]?.name === charDetails.value.Tag) {
        const mmrChange = showMMRchange(match.players[0]?.ratingChange);
        if (mmrChange) {
            return match.players[0]?.decision + ` (` + showMMRchange(match.players[0]?.ratingChange) + ')';
        } else {
            return match.players[0]?.decision;
        }
    } else {
        const mmrChange = showMMRchange(match.players[1]?.ratingChange);
        if (mmrChange) {
            return match.players[1]?.decision + ` (` + showMMRchange(match.players[1]?.ratingChange) + ')';
        } else {
            return match.players[1]?.decision;
        }
    }
}

</script>
<style scoped>
html {
    background-color: rgba(29, 29, 36, 0.904);
    color: rgb(191, 192, 192);
    margin: 15px;
}

.main-content {
    display: flex;
    flex-direction: column;
}

.panels {
    display: flex;
    justify-content: space-around;
}

.panel-title {
    text-align: center;
    margin: 0px 0px 25px 0px;
}

.stats > div {
    margin-bottom: 100px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 12px 16px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid rgba(154, 163, 199, 0.25);
    background: rgba(154, 163, 199, 0.06);
    color: #9aa3c7;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.back-link:hover {
    background: rgba(154, 163, 199, 0.14);
    border-color: rgba(154, 163, 199, 0.45);
    color: #c5cbe3;
}

.back-link:focus-visible {
    outline: 2px solid #5b8def;
    outline-offset: 2px;
}

.back-arrow {
    font-size: 1rem;
    line-height: 1;
    opacity: 0.85;
}

.back-icon {
    opacity: 0.9;
}

.raceStats,
.characterDetailsSection {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 15px;
    margin-left: 15px;
}

.raceStats > div,
.characterDetails {
    margin-right: 70px;
}

.matchWon {
    color: rgb(8, 163, 8);
}

.matchLost {
    color: rgb(196, 9, 9);
}

.winrate-block {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.winrate-title {
    margin-bottom: 20px;
}

.winrate-inner {
    font-size: x-large;
}

:deep(.v-progress-circular__overlay) {
  transition: none !important;
}

table {
    border-collapse: collapse;
    border-spacing: 10px 8px;
}

th,
td {
    padding: 4px 16px 10px 10px;
    border-bottom: 1px solid rgb(88, 76, 76);
}

thead td {
    font-weight: bold;
    border-bottom: 1px solid;
}

h1 {
    color: rgb(136, 143, 202);
}
</style>
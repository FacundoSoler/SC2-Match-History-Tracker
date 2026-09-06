<template>
    <router-link v-if="!isLoading" to="/" class="back-link">
        <v-icon icon="mdi-arrow-left" size="18" class="back-icon" />
        <span>Character Search</span>
    </router-link>

    <div v-if="!isLoading" class="main-content">
        <div class="panels">
            <div class="character-stats-panel">
                <h1 class="panel-title">Character Stats</h1>
                <div class="characterDetailsSection">
                    <table>
                        <caption>Character details</caption>
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

                <!-- WIN RATE CIRCULAR PROGRESS STATS -->
                <div class="winrate-block">
                    <div class="winrate-block-main-race-container ">
                        <div class="winrate-title">
                            Main Race winrate
                        </div>

                        <v-progress-circular :model-value="currentWinRate" :size="150" :width="15" color="primary">
                            <div class="winrate-inner winrate-inner-main"
                                :style="{ backgroundImage: `url(${setRaceIcon(winrateMainRace?.raceGames.race)})` }">
                                <span class="winrate-value">{{ currentWinRate }}</span>
                                <span class="winrate-sub">%</span>
                            </div>
                        </v-progress-circular>
                    </div>

                    <div v-if="winrateOffRaces.length > 0" class="winrate-block-offraces-container">
                        <div class="winrate-title">Off-Races winrates</div>

                        <div class="winrate-block-offraces-items">
                            <div v-for="stat in winrateOffRaces" :key="stat.raceGames.race">
                                <v-progress-circular :model-value="stat.winratePercentage" :size="100" :width="12"
                                    color="primary">
                                    <div class="winrate-inner winrate-inner-offrace"
                                        :style="{ backgroundImage: `url(${setRaceIcon(stat.raceGames.race)})` }">
                                        <span class="winrate-value">{{ stat.winratePercentage }}</span>
                                        <span class="winrate-sub">%</span>
                                    </div>
                                </v-progress-circular>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="hasAbandonedGames" class="abandoned-games">
                    <table>
                        <caption>Abandoned Games</caption>
                        <thead>
                            <tr>
                                <th>Race</th>
                                <th v-for="opp in ['Protoss', 'Zerg', 'Terran', 'Random']" :key="'th-' + opp">
                                    vs{{ opp }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="race in ['Protoss', 'Zerg', 'Terran', 'Random']" :key="race">
                                <tr v-if="showAbandonedGamesRow(race)">
                                    <td>{{ race }}</td>
                                    <td v-for="opp in ['Protoss', 'Zerg', 'Terran', 'Random']" :key="race + '-' + opp">
                                        {{ abandonedGames[race]['vs' + opp] || '' }}
                                    </td>
                                </tr>
                            </template>
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

            </div>

            <!-- WIN RATE CIRCULAR PROGRESS STATS -->
            <div class="matchHistory">
                <div v-show="sortedMatches" class="matchHistoryList">
                    <h1 class="panel-title">Match History</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Duration</td>
                                <td>Map Name</td>
                                <td>Outcome</td>
                                <td>Player 1</td>
                                <td>Player 2</td>
                                <td>Date</td>
                            </tr>
                        </thead>
                        <tbody v-for="match in sortedMatches">
                            <tr :class="{
                                'abandoned-game': isAbandonedGame(match)
                            }">
                                <td>{{ match.duration }}</td>
                                <td>{{ match.map }}</td>
                                <td :class="{
                                    matchWon: match.players[0]?.displayName === charDetails.Name
                                        && match.players[0].decision === 'WIN',
                                    matchLost: match.players[0]?.displayName === charDetails.Name
                                        && match.players[0].decision === 'LOSS'
                                }">{{ setOutcome(match) }}
                                </td>
                                <td>
                                    <img v-if="match.players[0]" :src="setRaceIcon(match.players[0].race)"
                                        :alt="match.players[0].race" width="16" height="16" />
                                    {{ match.players[0]
                                        ? `${match.players[0]?.name} (${match.players[0]?.mmr}
                                    ${showMMRchange(match.players[0]?.ratingChange)})`
                                        : "-- Unkown player --"
                                    }}
                                </td>
                                <td>
                                    <img v-if="match.players[1]" :src="setRaceIcon(match.players[1].race)"
                                        :alt="match.players[1].race" width="16" height="16" />
                                    {{ match.players[1]
                                        ? `${match.players[1]?.name} (${match.players[1]?.mmr}
                                    ${showMMRchange(match.players[1]?.ratingChange)})`
                                        : "-- Unkown player --"
                                    }}
                                </td>
                                <td>
                                    {{ DateFormatter.formatDateTimeLocal(match.datetime) }}
                                </td>
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
import { DateFormatter } from '../utils/dateFormatter';
import { GameModes } from '../models/gameModes';
import { WinrateStat } from '../models/winrateStat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const props = defineProps<{
    characterId: string,
    seasonId: number
}>();

let isLoading = ref(true);

const ABANDONED_GAME_THRESHOLD_IN_SECONDS = 60;
const sortedMatches = ref<any>(null);
const winrateMainRace = ref<WinrateStat>();
const winrateOffRaces = ref<WinrateStat[]>([]);

const targetWinRate = ref(0); // from our API data set
const currentWinRate = ref(0); // the actual value used in our circular progress Component (UI)

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

const abandonedGames = ref<Record<string, Record<string, number>>>({
    Protoss: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Zerg: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Terran: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Random: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 }
});

const hasAbandonedGames = ref(false);

onMounted(async () => {
    try {
        isLoading.value = true;

        console.time();
         await Promise.all([loadCharacterDetails(props.characterId),
        loadCharacterStats(props.characterId),
        loadMatchHistory(props.characterId)]);

        console.timeEnd();
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

    const parsedData = parsePulseMatches(data, { focalName: charDetails.value.Name });

    const characterName = parsedData.focalPlayer;
    sortedMatches.value = parsedData.matches.map((match: any) => ({
        ...match,
        players: [...match.players].sort((a, b) =>
            a.displayName === characterName ? -1 : b.displayName === characterName ? 1 : 0
        )
    }));

    extractAbandonedGames();

    setWinsPerRaceStats(parsedData.winsVsRace);
}

async function loadCharacterStats(characterId: string) {
    const url = `${API_BASE_URL}/character-teams?characterId=${characterId}&seasonId=${props.seasonId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    const mappedWinsPerRace: WinrateStat[] = data
        .filter((x: { queueType: number; }) => x.queueType === GameModes['1v1'])
        .map((raceMember: any) => {
            const raceGamesObj = raceMember.members[0]?.raceGames || {};

            return new WinrateStat({
                wins: raceMember.wins,
                losses: raceMember.losses,
                raceGames: {
                    race: String(Object.keys(raceGamesObj)[0] || 'UNKNOWN'),
                    games: Number(Object.values(raceGamesObj)[0] || 0)
                }
            })
        });

    const sortedWinsPerRace = mappedWinsPerRace.sort((a, b) => b.raceGames?.games - a.raceGames?.games);
    const [mainRace, ...offRaces] = sortedWinsPerRace;

    winrateMainRace.value = mainRace;
    winrateOffRaces.value = offRaces;

    targetWinRate.value = mainRace.winratePercentage;
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
    if (race?.toUpperCase() === "TERRAN") return "/assets/terran.svg";
    if (race?.toUpperCase() === "PROTOSS") return "/assets/protoss.svg";
    if (race?.toUpperCase() === "ZERG") return "/assets/zerg.svg";
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

function isAbandonedGame(match: any) {
    const isAbandonedGame =
        (match.durationSeconds
            && match.players[0]?.displayName === charDetails.value.Name
            && match.durationSeconds < ABANDONED_GAME_THRESHOLD_IN_SECONDS)
        && match.players[0].decision === 'LOSS';

    return isAbandonedGame;
}

function extractAbandonedGames() {
    for (const match of sortedMatches.value) {
        // Guard clauses: Check players exist, duration is less than the expected threshold, name matches Character and is a LOSS
        if (!match.players || match.players.length < 2) continue;
        if (typeof match.durationSeconds !== 'number' || match.durationSeconds > ABANDONED_GAME_THRESHOLD_IN_SECONDS) continue;
        if (match.players[0].displayName !== charDetails.value.Name) continue;
        if (match.players[0].decision.toUpperCase() !== 'LOSS') continue;

        const race1 = match.players[0].race;
        const race2 = match.players[1].race;
        const vsKey = `vs${race2}`;

        if (abandonedGames.value[race1] && vsKey in abandonedGames.value[race1]) {
            abandonedGames.value[race1][vsKey]++;
        }

        hasAbandonedGames.value = true;
    }
}

function showAbandonedGamesRow(race: string) {
    if (abandonedGames.value[race].vsProtoss === 0
        && abandonedGames.value[race].vsZerg === 0
        && abandonedGames.value[race].vsTerran === 0
        && abandonedGames.value[race].vsRandom === 0) {
        return false;
    }

    return true;
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
    margin-top: 10px;
}

.panels {
    display: flex;
    justify-content: space-around;
}

.panel-title {
    text-align: center;
    margin: 0px 0px 25px 0px;
}

.character-stats-panel {
    flex: 0 1 auto;
    min-width: 500px; 
    max-width: 800px;
}

.character-stats-panel>div {
    margin-bottom: 65px;
}

.back-link {
    position: absolute;
    display: inline-flex;
    align-items: center;
    margin-left: 10px;
    gap: 8px;
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

.abandoned-games,
.raceStats,
.characterDetailsSection {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    margin-left: 15px;
}

.abandoned-game {
    background-color: rgb(109 12 12);
}

.raceStats>div,
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
    flex-direction: row;
    align-items: center;
    gap: 40px;
}

.winrate-block-main-race-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* --- LAYOUT CONTAINERS --- */
.winrate-block-offraces-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1 0 auto;
    align-items: center;
    justify-content: center;
}

.winrate-block-offraces-items {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

.winrate-title {
    margin-bottom: 20px;
}

.winrate-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.winrate-inner::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: inherit;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50%;
    opacity: 0.6;
}

.winrate-inner .winrate-value,
.winrate-inner .winrate-sub {
    z-index: 1;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

/* --- TYPOGRAPHY & COLORS --- */
:deep(.winrate-inner .winrate-value),
.winrate-inner .winrate-value {
    color: #ffffff !important;
    font-weight: 700;
    letter-spacing: -0.5px;
}

:deep(.winrate-inner .winrate-sub),
.winrate-inner .winrate-sub {
    color: #ffffff !important;
    font-weight: 700;
    margin-left: 1px;
}

.winrate-inner-main .winrate-value {
    font-size: 1.50rem;
}

.winrate-inner-main .winrate-sub {
    font-size: 1rem;
}

.winrate-inner-offrace .winrate-value {
    font-size: 1.25rem;
}

.winrate-inner-offrace .winrate-sub {
    font-size: 1rem;
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

caption {
    margin-bottom: 10px;
}
</style>
<template>
    <router-link
        class="back-link"
        v-if="!isLoading"
        to="/"
    >
        <v-icon
            class="back-icon"
            icon="mdi-arrow-left"
            size="18"
        />
        <span>Character Search</span>
    </router-link>

    <div
        v-if="!isLoading"
        class="main-content"
    >
        <div class="panels">
            <character-stats
                :character-matches="characterMatches?.matches"
                :character-teams-data="characterTeamsData"
                :character-wins-vs-race="characterMatches?.winsVsRace"
                :character-details="characterDetails"
                :character-id="props.characterId"
                :season-id="props.seasonId"
            >
            </character-stats>
            <match-history-list
                :character-details="characterDetails"
                :character-matches="characterMatches?.matches"
                :character-id="props.characterId"
            >
            </match-history-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CharacterStats from './CharacterStats.vue';
import MatchHistoryList from './MatchHistoryList.vue';
import { parsePulseMatches } from '../parsePulseMatches.js';
import { ICharacterDetails } from '../models/ICharacterDetails';

const props = defineProps<{
    characterId: string,
    seasonId: number
}>();

const characterDetails = ref<ICharacterDetails>();
const characterTeamsData = ref<any[]>();
const characterMatches = ref<{ matches: any[]; winsVsRace: any } | null>(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isLoading = ref(true);

onMounted(async () => {
    try {
        isLoading.value = true;

        console.time();

        let characterDetailsRawData: any;
        [characterDetailsRawData, characterTeamsData.value] = await Promise.all([
            loadCharacterDetails(props.characterId),
            loadCharacterTeamsData(props.characterId)]);
        getCharacterDetails(characterDetailsRawData);

        const rawMatchesData = await loadMatchHistory(props.characterId);
        getCharacterMatches(rawMatchesData);

        console.timeEnd();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});

async function loadCharacterDetails(characterId: string) {
    const url = `${API_BASE_URL}/characterDetails?characterId=${characterId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    let data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data[0];
}

function getCharacterDetails(data: any) {
    characterDetails.value = data.members.character;
}

async function loadCharacterTeamsData(characterId: string) {
    const url = `${API_BASE_URL}/character-teams?characterId=${characterId}&seasonId=${props.seasonId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data;
}

async function loadMatchHistory(characterId: string) {
    const url = `${API_BASE_URL}/matches?characterId=${characterId}`;

    const response = await fetch(url);
    if (!response || !response.ok) throw new Error('Failed to fetch SC2 Pulse Match History data.');

    const data = await response.json();
    if (!data.result && !Array.isArray(data.result)) throw new Error('Error parsing SC2 Pulse Match History data');

    return data;
}

function getCharacterMatches(rawMatchesData: any) {
    const parsedData = parsePulseMatches(rawMatchesData, { focalName: characterDetails.value?.name });

    const characterName = parsedData.focalPlayer;
    const matches = parsedData.matches.map((match: any) => ({
        ...match,
        players: [...match.players].sort((a, b) =>
            a.displayName === characterName ? -1 : b.displayName === characterName ? 1 : 0
        )
    }));

    characterMatches.value = {
        matches: matches,
        winsVsRace: parsedData.winsVsRace
    };

    console.log('sortedMatches', characterMatches.value);
}

</script>
<style>
html {
    background-color: rgba(29, 29, 36, 0.904);
    color: rgb(191, 192, 192);
    margin: 15px;
    overflow-y: hidden !important;
}

h1 {
    color: rgb(136, 143, 202);
}

caption {
    margin-bottom: 10px;
}

table {
    border-collapse: collapse;
    border-spacing: 10px 8px;

    th,
    td {
        padding: 4px 16px 10px 10px;
        border-bottom: 1px solid rgb(88, 76, 76);
    }

    thead td {
        font-weight: bold;
        border-bottom: 1px solid;
    }
}

.main-content {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .panels {
        display: flex;
        justify-content: space-around;

        .panel-title {
            text-align: center;
            margin: 0px 0px 25px 0px;
        }
    }
}

.back-link {
    position: absolute;
    display: inline-flex;
    align-items: center;
    margin: 10px;
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

    &:hover {
        background: rgba(154, 163, 199, 0.14);
        border-color: rgba(154, 163, 199, 0.45);
        color: #c5cbe3;
    }

    &:focus-visible {
        outline: 2px solid #5b8def;
        outline-offset: 2px;
    }

    .back-icon {
        opacity: 0.9;
    }
}
</style>
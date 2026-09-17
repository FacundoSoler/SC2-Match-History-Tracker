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
import { ICharacterDetails } from '../models/ICharacterDetails';
import { getCharacterMatches } from '../utils/formatter.js';
import { loadCharacterDetails, loadCharacterTeamsData, loadMatchHistory } from '../services/characterDetailsService.js';

const props = defineProps<{
    characterId: number,
    seasonId: number
}>();

const characterDetails = ref<ICharacterDetails>();
const characterTeamsData = ref<any[]>();
const characterMatches = ref<{ matches: any[]; winsVsRace: any } | null>(null);

let isLoading = ref(true);

onMounted(async () => {
    try {
        isLoading.value = true;

        console.time();

        let characterDetailsRawData: any;
        [characterDetailsRawData, characterTeamsData.value] = await Promise.all([
            loadCharacterDetails(props.characterId),
            loadCharacterTeamsData(props.characterId, props.seasonId)]);
        getCharacterDetails(characterDetailsRawData);

        const rawMatchesData = await loadMatchHistory(props.characterId);
        characterMatches.value = getCharacterMatches(rawMatchesData, characterDetails.value!, props.characterId);

        console.timeEnd();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});

function getCharacterDetails(data: any) {
    characterDetails.value = data.members.character;
    characterDetails.value!.proNickname = data.members?.proNickname;
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
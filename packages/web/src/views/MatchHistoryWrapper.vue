<template>
    <div
        class="panels"
        v-if="!isLoading"
    >
        <character-stats
            :character-matches="characterMatches!"
            :character-teams-data="characterTeamsData"
            :character-details="characterDetails"
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
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CharacterStats from './CharacterStats.vue';
import MatchHistoryList from './MatchHistoryList.vue';
import { ICharacterDetails } from '../models/ICharacterDetails';
import { getCharacterMatches } from '../utils/formatter.js';
import { loadCharacterDetails, loadCharacterTeamsData, loadMatchHistory } from '../services/characterDetailsService.js';

const characterDetails = ref<ICharacterDetails>();
const characterTeamsData = ref<any[]>();
const characterMatches = ref<{ matches: any[]; winsVsRace: any } | null>(null);

const props = defineProps<{
    characterId: number,
    seasonId: number
}>();

const emit = defineEmits(['loading-change']);

let isLoading = ref(true);

onMounted(async () => {
    try {
        isLoading.value = true;
        emit('loading-change', true);

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
        emit('loading-change', false);
    }
});

function getCharacterDetails(data: any) {
    characterDetails.value = data.members.character;
    characterDetails.value!.proNickname = data.members?.proNickname;
    characterDetails.value!.ratingMax = data.ratingMax;
}
</script>
<style scoped>
.panels {
    display: flex;
    justify-content: space-around;
    flex: 1;
    min-height: 0;
    max-width: auto;
    margin: 0 auto;
    gap: 20px;

    .panel-title {
        text-align: center;
        margin: 0px 0px 25px 0px;
    }
}
</style>
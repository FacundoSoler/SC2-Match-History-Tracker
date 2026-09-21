<template>
    <form @submit.prevent="searchCharacterId()">
        <div class="main-container">
            <div :class="getStatusStyle()">
                <table>
                    <tbody>
                        <tr>
                            <td><label for=""><b>Status:</b> </label></td>
                            <td>{{ status.statusLabel }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- SECTION 1: Local Player Setup -->
            <fieldset
                class="section-container player-section"
                v-if="status.status !== 'OFFLINE'"
            >
                <legend class="section-title">Local Player Setup</legend>

                <div class="searchPanel">
                    <label>Enter your SC2 battleNetProfile : </label>

                    <v-text-field
                        width="200px"
                        v-model="battleNetProfile"
                        placeholder="name, btag#123, [cLaN],"
                        variant="outlined"
                        density="compact"
                        hide-details
                        color="#0d6efd"
                        class="sc2-search-input"
                    ></v-text-field>
                    <v-btn
                        type="submit"
                        color="#0d6efd"
                        class="sc2-search-btn"
                        height="40"
                        elevation="0"
                        :loading="isLoading"
                    >Search
                    </v-btn>
                </div>

                <div
                    v-if="characterName"
                    class="searchResultsPanel"
                >
                    <label>Your character: </label>
                    <div class="characterName">
                        {{ characterName }}
                    </div>

                    <label for="">Account: </label>
                    <div class="characterAccountName">
                        {{ characterAccountBattleTag }}
                    </div>
                </div>

                <v-label
                    v-if="!isValidBattleNetProfile"
                    class="errorLabel"
                >{{ errorLabel }}</v-label>

            </fieldset>

            <fieldset
                class="section-container opponent-section"
                v-if="opponentCharacterId && seasonId"
            >
                <legend class="section-title">Opponent data</legend>

                <div
                    v-if="isMatchHistoryLoading"
                    class="loader-container"
                >
                    <v-progress-circular
                        indeterminate
                        color="#0d6efd"
                        size="64"
                        width="6"
                    />
                </div>

                <match-history-wrapper
                    style="margin-top: -30px;"
                    v-show="!isMatchHistoryLoading"
                    @loading-change="isMatchHistoryLoading = $event"
                    :character-id="opponentCharacterId"
                    :season-id="seasonId"
                >
                </match-history-wrapper>
            </fieldset>
        </div>
    </form>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getCurrentSeason, searchCharactersByName } from '../services/characterDetailsService';
import { getOpponentCharacterId, getOpponentName, getOpponentRace } from '../services/inGameDetectionService';
import MatchHistoryWrapper from './MatchHistoryWrapper.vue';

export interface Game {
    isReplay: boolean;
    displayTime: number;
    players: {
        id: number;
        name: string;
        type: string;
        race: string;
        result: string;
    }[];
};

interface sc2Data {
    gameData: Game,
    UIdata: {
        activeScreens: any
    }
};

enum SC2Screens {
    ScreenBackgroundSC2 = 'ScreenBackgroundSC2/ScreenBackgroundSC2',
    ScreenNavigationSC2 = 'ScreenNavigationSC2/ScreenNavigationSC2',
    ScreenForegroundSC2 = 'ScreenForegroundSC2/ScreenForegroundSC2',
    ScreenMultiplayer = 'ScreenMultiplayer/ScreenMultiplayer',
    ScreenLoading = 'ScreenLoading/ScreenLoading',
    ScreenScore = 'ScreenScore/ScreenScore'
}

enum SC2Status {
    OFFLINE = 'OFFLINE',
    ONLINE = 'ONLINE',
    LOADING = 'LOADING GAME',
    INGAME = 'IN-GAME',
    SCORESCREEN = 'SCORE SCREEN'
}

const status = ref({
    status: SC2Status.OFFLINE,
    statusLabel: `${SC2Status.OFFLINE} - Waiting for Starcraft 2 to run ...`
});

const isLoading = ref(false);
const isMatchHistoryLoading = ref(true);

const errorLabel = ref('');
const sc2Data = ref<sc2Data>();
const seasonId = ref<number>();
const opponentCharacterId = ref<number>();

const battleNetProfile = ref('');
const isValidBattleNetProfile = ref(false);
const characterName = ref('');
const characterTag = ref('');
const characterRegion = ref('');
const characterRating = ref(0);
const characterAccountBattleTag = ref('');
const characterDetails = ref<any>();

onMounted(async () => {
    window.addEventListener('message', processIncomingSC2APIData);

    seasonId.value = await getCurrentSeason() || 0;

    setInterval(requestSC2Data, 1000);
    window.postMessage({ type: 'REQUEST_SC2_DATA' }, '*');
});

onUnmounted(() => {
    window.removeEventListener('message', processIncomingSC2APIData)
});

async function searchCharacterId() {
    isLoading.value = true;

    try {
        isValidBattleNetProfile.value = true;

        const result = await searchCharactersByName(battleNetProfile.value);
        if (result && result.length === 1) {
            characterDetails.value = result[0];

            characterName.value = characterDetails.value.members.character.name;
            characterAccountBattleTag.value = characterDetails.value.members.account.battleTag;
            characterTag.value = characterDetails.value.members.character.tag;
            characterRegion.value = characterDetails.value.members.character.region;
            characterRating.value = characterDetails.value.currentStats?.rating || characterDetails.value.previousStats?.rating;
        }

        await requestSC2Data();
    } catch (error) {
        console.error('Error searching for Character - InGameDetection', error);
    } finally {
        isLoading.value = false;
    }
}

function setStatus(statusValue: SC2Status, statusLabel: string) {
    status.value.status = statusValue;
    status.value.statusLabel = `${statusValue} - ${statusLabel}`;

    console.log('setStatus CALLED !', statusValue, statusLabel);
}

const processIncomingSC2APIData = async (event: any) => {
    if (!event.data || event.data.type !== 'RECEIVE_SC2_DATA') {
        return;
    }

    const response = event.data.payload
    if (!response.success) {
        if (status.value.status === SC2Status.OFFLINE) return;

        setStatus(SC2Status.OFFLINE, 'Waiting for Starcraft 2 to run ...');
        return;
    }

    const data = response.mappedData as sc2Data;
    sc2Data.value = data;

    const screens = sc2Data.value?.UIdata.activeScreens;
    const game = sc2Data.value?.gameData;

    const hasHumanPlayers = game.players?.length > 0 && game.players?.every(x => x.type === 'user');
    const isNewGame = game.displayTime === 0 && hasHumanPlayers;

    // Match Loading Screen
    if (isNewGame) {
        const opponentName = getOpponentName(sc2Data.value.gameData, characterTag.value);
        const opponentRace = getOpponentRace(sc2Data.value.gameData, characterTag.value);
        const opponentCharacterList = await searchCharactersByName(opponentName!);
        opponentCharacterId.value = await getOpponentCharacterId(opponentCharacterList, opponentName!, opponentRace!, characterRegion.value, characterRating.value);
    }
    else if (screens[SC2Screens.ScreenScore]) {
        setStatus(SC2Status.SCORESCREEN, 'Game finished !');
    }
    else {
        setStatus(SC2Status.ONLINE, 'Starcraft 2 is running. Waiting for a game ... ');
    }
}

function requestSC2Data() {
    window.postMessage({
        type: "REQUEST_SC2_DATA",
    }, "*");
}

function getStatusStyle() {
    if (status.value.status === SC2Status.ONLINE) {
        return 'statusOnline';
    }

    return '';
}

</script>
<style scoped>
form {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    width: 100%;
}

.main-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    margin: 0px 0px 0px 0px;
    height: 100%;
    min-height: 0;
}

.section-container {
    border: 1px solid #2e3548;
    border-radius: 8px;
    padding: 16px 20px;
    width: 100%;
    max-width: 1700px;
    background-color: rgba(255, 255, 255, 0.015);
}

.section-title {
    font-weight: 600;
    font-size: 0.85rem;
    color: #0d6efd;
    padding: 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.player-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    flex-shrink: 0;
}

.opponent-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.loader-container {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.searchPanel {
    display: flex;
    align-items: center;
    margin-top: -10px;
}

.searchResultsPanel {
    margin: 10px 0px -5px 0px;
    display: flex;
    gap: 10px;
}

.characterName {
    color: rgb(36, 194, 21);
}

.characterAccountName {
    color: rgb(162, 16, 199);
}

.errorLabel {
    color: rgb(190, 8, 8);
    margin-top: 10px;
}

table {
    border-collapse: collapse;
}

tbody>tr,
td {
    border: beige 1px solid;
}

.statusOnline {
    background-color: #0d5d08;
}
</style>
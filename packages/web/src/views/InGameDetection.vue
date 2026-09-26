<template>
    <form @submit.prevent="searchCharacterId()">
        <div>
            <div
                v-if="!isExtensionInstalled"
                class="extension-prompt"
            >
                <p>Install the companion extension to track live matches:</p>

                <a
                    href="https://chromewebstore.google.com/detail/nmihlpcdkfbhkcchfjoaadgnfioiphpb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="/assets/chrome-store-download-icon.png"
                        alt="Available in the Chrome Web Store"
                        class="chrome-badge"
                    />
                </a>
            </div>

            <div
                v-else
                class="main-container"
            >
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

                        ||

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
                        :region="characterRegion"
                        :battlenet-id="characterBattlenetId"
                        :realm="characterRealm"
                    >
                    </match-history-wrapper>
                </fieldset>
            </div>

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
const isExtensionInstalled = ref(false);
const isMatchHistoryLoading = ref(true);

const errorLabel = ref('');
const sc2Data = ref<sc2Data>();
const seasonId = ref<number>();
const opponentCharacterId = ref<number | null>(null);

const battleNetProfile = ref('');
const isValidBattleNetProfile = ref(false);
const characterName = ref('');
const characterTag = ref('');
const characterRegion = ref('');
const characterRating = ref(0);
const characterAccountBattleTag = ref('');
const characterDetails = ref<any>();

const characterBattlenetId = ref(0);
const characterRealm = ref(1);

const isTrackingMatch = ref(false);
let pollingInterval: ReturnType<typeof setInterval>;

onMounted(async () => {
    window.addEventListener('message', handleExtensionMessages);

    window.postMessage({ type: 'CHECK_EXTENSION_INSTALL' }, '*');

    seasonId.value = await getCurrentSeason() || 0;

    //await requestSC2Data();

    pollingInterval = setInterval(requestSC2Data, 1000);
});

onUnmounted(() => {
    clearInterval(pollingInterval!);
    window.removeEventListener('message', handleExtensionMessages);
});

const handleExtensionMessages = async (event: MessageEvent) => {
    if (event.data?.type === "EXTENSION_CONFIRM_INSTALL") {
        isExtensionInstalled.value = true;
        return;
    }

    if (event.data && event.data?.type === 'RECEIVE_SC2_DATA') {
        const response = event.data.payload;
        // Safely handle missing response objects or failed backend responses
        if (!response?.success) {
            if (status.value.status === SC2Status.OFFLINE) return;

            isTrackingMatch.value = false;
            setStatus(SC2Status.OFFLINE, 'Waiting for Starcraft 2 to run ...');
            return;
        }

        const data = response.mappedData as sc2Data;
        const game = data.gameData;

        // 1. Extract active screen keys from the mapped object sent by background.js
        const screensObj = data.UIdata?.activeScreens || {};
        const activeScreenList = Object.keys(screensObj);
        const hasActiveScreens = activeScreenList.length > 0;

        // 2. Strict live match verification
        const isLiveGame =
            !game.isReplay &&
            game.players?.length === 2 &&
            game.players.every((p: any) => p.type === 'user') &&
            game.players.every((p: any) => p.result === 'Undecided') &&
            !hasActiveScreens; // An active match has 0 menu screen keys ({})

        if (isLiveGame) {
            const previousData = sc2Data.value;
            const prevDisplayTime = previousData?.gameData?.displayTime ?? -1;
            const isTimerReset = game.displayTime < prevDisplayTime;

            // 3. Trigger search on match start OR game timer restart
            if (!isTrackingMatch.value || isTimerReset) {
                isTrackingMatch.value = true;

                // Instantly wipe stale UI data from the previous game
                opponentCharacterId.value = null;

                setStatus(SC2Status.INGAME, 'Match detected! Fetching opponent data...');

                const opponentName = getOpponentName(game, characterTag.value);
                console.log(`[SC2 Tracker] New match detected vs. ${opponentName}. Initiating fetch...`);

                try {
                    const opponentRace = getOpponentRace(game, characterTag.value);

                    if (opponentName) {
                        const opponentCharacterList = await searchCharactersByName(opponentName);

                        if (opponentCharacterList && opponentCharacterList.length > 0) {
                            opponentCharacterId.value = await getOpponentCharacterId(
                                opponentCharacterList,
                                opponentName,
                                opponentRace!,
                                characterRegion.value,
                                characterRating.value
                            );
                            console.log(`[SC2 Tracker] Successfully fetched profile for ${opponentName}.`);
                        } else {
                            console.warn(`[SC2 Tracker] Match detected, but no ladder profile was found for ${opponentName}.`);
                        }
                    }
                } catch (error) {
                    console.error("[SC2 Tracker] Opponent fetch failed:", error);
                } finally {
                    setStatus(SC2Status.INGAME, 'In Game');
                }
            }
        } else {
            // 4. User is in menu, watching replay, or match has finished
            isTrackingMatch.value = false;

            const isScoreScreen =
                activeScreenList.some(s => s.includes('ScreenScore')) ||
                game.players?.some((p: any) => p.result === 'Victory' || p.result === 'Defeat');

            if (isScoreScreen && hasActiveScreens) {
                setStatus(SC2Status.SCORESCREEN, 'Game finished !');
            } else {
                setStatus(SC2Status.ONLINE, 'Starcraft 2 is running. Waiting for a game ...');
            }
        }

        sc2Data.value = data;
        return;
    }
}

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

            characterBattlenetId.value = characterDetails.value.members.character.battlenetId;
            characterRealm.value = characterDetails.value.members.character.realm;
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
}

function requestSC2Data() {
    window.postMessage({
        type: "REQUEST_SC2_DATA",
        customParam: "Test"
    }, "*");
}

function getStatusStyle() {
    if (status.value.status === SC2Status.ONLINE) {
        return 'statusOnline';
    }

    if (status.value.status === SC2Status.SCORESCREEN) {
        return 'statusScoreScreen';
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
    margin: 5px 0px 0px 0px;
    height: 100%;
    min-height: 0;
}

.extension-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: #1e1e24;
    /* Adjust to match your dark theme */
    border-radius: 8px;
}

.chrome-badge {
    height: 58px;
    /* Official Google recommended height */
    width: auto;
    transition: transform 0.2s ease;
}

.chrome-badge:hover {
    transform: scale(1.02);
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

.statusScoreScreen {
    background-color: #4949b7;
}
</style>
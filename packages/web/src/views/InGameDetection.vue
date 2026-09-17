<template>
    <form @submit.prevent="searchCharacterId()">
        <div class="main-container">
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td><label for=""><b>Status:</b> </label></td>
                            <td>{{ status.statusLabel }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="status.status !== 'OFFLINE'"
                class="searchPanel"
            >
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
        </div>
    </form>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getCurrentSeason, searchCharactersByName } from '../services/characterDetailsService';
import { getOpponentCharacterId, getOpponentName, getOpponentRace } from '../services/inGameDetectionService';

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
    status: '',
    statusLabel: ''
});

const isLoading = ref(false);
const errorLabel = ref('');
const sc2Data = ref<sc2Data>();
const seasonId = ref(0);

const battleNetProfile = ref('');
const isValidBattleNetProfile = ref(false);
const characterName = ref('');
const characterTag = ref('');
const characterRegion = ref('');
const characterRating = ref(0);
const characterAccountBattleTag = ref('');
const characterDetails = ref<any>();

onMounted(async () => {
    window.addEventListener('message', processSC2APIData);

    seasonId.value = await getCurrentSeason() || 0;

    window.postMessage({ type: 'REQUEST_SC2_DATA' }, '*');
});

onUnmounted(() => {
    window.removeEventListener('message', processSC2APIData)
});

async function searchCharacterId() {
    const sc2ProfileRegex = /^battlenet::\/\/starcraft\/profile\/\d+\/\d+$/;
    const isValid: boolean = sc2ProfileRegex.test(battleNetProfile.value);

    if (!isValid) {
        errorLabel.value = `Please enter a valid battleNet profile link.
        e.g.: battlenet:://starcraft/profile/1/5023145337083133333`;
        isValidBattleNetProfile.value = false;
        return;
    }

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
}

function pingGame() {
    // setInterval(fetchGameData, 1000);
}

function setStatus(statusValue: string, statusLabel: string) {
    status.value.status = statusValue;
    status.value.statusLabel = `${statusValue} - ${statusLabel}`;
}

const processSC2APIData = async (event: any) => {
    if (!event.data || event.data.type !== 'RECEIVE_SC2_DATA') {
        return;
    }

    const response = event.data.payload
    if (!response.success) {
        setStatus(SC2Status.OFFLINE, 'Waiting for Starcraft 2 to run ...');
        return;
    }

    const data = response.data as sc2Data;
    if (JSON.stringify(sc2Data.value?.UIdata.activeScreens) === JSON.stringify(data.UIdata.activeScreens)) {
        return;
    }

    sc2Data.value = data;
    const screens = sc2Data.value?.UIdata.activeScreens;
    const game = sc2Data.value?.gameData;

    const hasHumanPlayers = game.players?.length > 0 && game.players?.every(x => x.type === 'user');
    const isNewGame = screens[SC2Screens.ScreenLoading] && hasHumanPlayers;

    // Match Loading Screen
    if (isNewGame) {
        const opponentName = getOpponentName(sc2Data, characterTag.value);
        console.log('opponentName', opponentName);

        const opponentRace = getOpponentRace(sc2Data, characterTag.value);
        console.log('opponentRace', opponentRace);

        const opponentCharacterList = await searchCharactersByName(opponentName!);
        console.log('opponentCharacterList', opponentCharacterList);

        const opponentCharacterID = await getOpponentCharacterId(opponentCharacterList, opponentName!, opponentRace!, characterRegion.value, characterRating.value);
        console.log('opponentCharacterID', opponentCharacterID);
        // TODO : Once we get the 'opponentCharacterID' we can load up their Match History + Character Details panels.


    }
    else if (screens[SC2Screens.ScreenScore]) {
        setStatus(SC2Status.SCORESCREEN, 'Game finished !');
    }
    else {
        setStatus(SC2Status.ONLINE, 'Starcraft 2 is running ... waiting for game ... ');
    }

    console.log('Status', status.value);
}

function requestSC2Data() {
    window.postMessage({ type: "REQUEST_SC2_DATA" }, "*");
}


</script>
<style scoped>
.main-container {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.searchPanel {
    margin-top: 20px;
    display: flex;
    align-items: center;
}

.searchResultsPanel {
    margin-top: 10px;
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
</style>
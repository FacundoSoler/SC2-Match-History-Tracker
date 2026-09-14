<template>
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
                        <td>{{ props.characterDetails.name }}</td>
                        <td>{{ props.characterDetails.battleTag }}</td>
                        <td>
                            {{ props.characterDetails.region }} -
                            <img
                                :src="getRegionIcon(props.characterDetails.region)"
                                width="22px"
                            >
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

                <v-progress-circular
                    :model-value="currentWinRate"
                    :size="150"
                    :width="15"
                    color="primary"
                >
                    <div
                        class="winrate-inner winrate-inner-main"
                        :style="{ backgroundImage: `url(${getRaceIcon(winrateMainRace?.raceGames.race)})` }"
                    >
                        <span class="winrate-value">{{ currentWinRate }}</span>
                        <span class="winrate-sub">%</span>
                    </div>
                </v-progress-circular>
            </div>

            <div
                v-if="winrateOffRaces.length > 0"
                class="winrate-block-offraces-container"
            >
                <div class="winrate-title">Off-Races winrates</div>

                <div class="winrate-block-offraces-items">
                    <div
                        v-for="stat in winrateOffRaces"
                        :key="stat.raceGames.race"
                    >
                        <v-progress-circular
                            :model-value="stat.winratePercentage"
                            :size="100"
                            :width="12"
                            color="primary"
                        >
                            <div
                                class="winrate-inner winrate-inner-offrace"
                                :style="{ backgroundImage: `url(${getRaceIcon(stat.raceGames.race)})` }"
                            >
                                <span class="winrate-value">{{ stat.winratePercentage }}</span>
                                <span class="winrate-sub">%</span>
                            </div>
                        </v-progress-circular>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="hasAbandonedGames"
            class="abandoned-games"
        >
            <table>
                <caption>Abandoned Games</caption>
                <thead>
                    <tr>
                        <th>Race</th>
                        <th
                            v-for="opp in ['Protoss', 'Zerg', 'Terran', 'Random']"
                            :key="'th-' + opp"
                        >
                            vs{{ opp }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template
                        v-for="race in ['Protoss', 'Zerg', 'Terran', 'Random']"
                        :key="race"
                    >
                        <tr v-if="showHideAbandonedGamesRow(race)">
                            <td>{{ race }}</td>
                            <td
                                v-for="opp in ['Protoss', 'Zerg', 'Terran', 'Random']"
                                :key="race + '-' + opp"
                            >
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
                        <td><img
                                :src="getRaceIcon('Protoss')"
                                width="15px"
                            ></td>
                        <td><img
                                :src="getRaceIcon('Zerg')"
                                width="20px"
                            ></td>
                        <td><img
                                :src="getRaceIcon('Terran')"
                                width="25px"
                            ></td>
                        <td><img
                                :src="getRaceIcon('Random')"
                                width="20px"
                            ></td>
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
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, watchEffect } from 'vue';
import { getRegionIcon } from '../utils/assetsHelper';
import { getRaceIcon } from '../utils/formatter';
import { WinrateStats } from '../models/winrateStats';
import { GameModes } from '../models/gameModes';

const props = defineProps<{
    characterId: string,
    seasonId: number,
    characterMatches: any,
    characterDetails: any,
    characterTeamsData: any,
    characterWinsVsRace: any
}>();

let stats: Partial<{
    Protoss: string,
    Terran: string,
    Zerg: string,
    Random: string
}> = {};

const ABANDONED_GAME_THRESHOLD_IN_SECONDS = 60;
const winrateMainRace = ref<WinrateStats>();
const winrateOffRaces = ref<WinrateStats[]>([]);

const targetWinRate = ref(0); // from our API data set
const currentWinRate = ref(0); // the actual value used in our circular progress Component (UI)

const abandonedGames = ref<Record<string, Record<string, number>>>({
    Protoss: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Zerg: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Terran: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 },
    Random: { vsProtoss: 0, vsZerg: 0, vsTerran: 0, vsRandom: 0 }
});

const hasAbandonedGames = ref(false);
const isLoading = ref(false);

let tickTimer: ReturnType<typeof setInterval> | null = null;

onUnmounted(() => {
    if (tickTimer) clearInterval(tickTimer);
});

watchEffect(() => {
    if (!props.characterTeamsData || !props.characterWinsVsRace || !props.characterMatches) {
        return;
    }

    try {
        isLoading.value = true;
        getCharacterTeamsStats(props.characterTeamsData);
        console.log('getCharacterTeamsStats');

        getWinsPerRaceStats(props.characterWinsVsRace);
        console.log('getWinsPerRaceStats');

        getAbandonedGamesStats();
        console.log('getAbandonedGamesStats');

    } catch (error) {
        console.error('Error parsing character stats:', error);
    } finally {
        isLoading.value = false;
    }
});

watch(
    () => targetWinRate.value,
    (newTarget) => {
        if (newTarget > 0) {
            animateWinrateCircularProgress();
        }
    },
    { immediate: true } // Runs immediately if props are already loaded on mount
);

function animateWinrateCircularProgress() {
    console.log('animateWinrateCircularProgress started ! ');

    if (tickTimer) clearInterval(tickTimer);

    currentWinRate.value = 0;
    const totalSteps = targetWinRate.value;
    if (totalSteps <= 0) return;

    const timeInterval = 750 / totalSteps;

    tickTimer = setInterval(() => {
        currentWinRate.value++;
        if (currentWinRate.value >= targetWinRate.value) {
            if (tickTimer) clearInterval(tickTimer);
        }
    }, timeInterval);
}

function getCharacterTeamsStats(characterTeamsData: any) {
    if (!Array.isArray(characterTeamsData) || characterTeamsData.length === 0) return;

    const mappedWinsPerRace: WinrateStats[] = characterTeamsData
        .filter((x: { queueType: number; }) => x.queueType === GameModes['1v1'])
        .map((raceMember: any) => {
            const raceGamesObj = raceMember.members[0]?.raceGames || {};

            return new WinrateStats({
                wins: raceMember.wins,
                losses: raceMember.losses,
                raceGames: {
                    race: String(Object.keys(raceGamesObj)[0] || 'UNKNOWN'),
                    games: Number(Object.values(raceGamesObj)[0] || 0)
                }
            })
        });

    const sortedWinsPerRace = mappedWinsPerRace.sort((a, b) => b.raceGames?.games - a.raceGames?.games);
    if (sortedWinsPerRace.length > 0) {
        const [mainRace, ...offRaces] = sortedWinsPerRace;

        winrateMainRace.value = mainRace;
        winrateOffRaces.value = offRaces;

        targetWinRate.value = mainRace.winratePercentage;
        console.log('targetWinRate.value changed !');
    }
}

function showHideAbandonedGamesRow(race: string) {
    if (abandonedGames.value[race].vsProtoss === 0
        && abandonedGames.value[race].vsZerg === 0
        && abandonedGames.value[race].vsTerran === 0
        && abandonedGames.value[race].vsRandom === 0) {
        return false;
    }

    return true;
}

function getAbandonedGamesStats() {
    if (!Array.isArray(props.characterMatches)) return;

    for (const match of props.characterMatches) {
        // Guard clauses: Check players exist, duration is less than the expected threshold, name matches Character and is a LOSS
        if (!match.players || match.players.length < 2) continue;
        if (typeof match.durationSeconds !== 'number' || match.durationSeconds > ABANDONED_GAME_THRESHOLD_IN_SECONDS) continue;
        if (match.players[0].displayName !== props.characterDetails.name) continue;
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

function getWinsPerRaceStats(winsVsRace: any) {
    if (!winsVsRace) return;

    stats.Protoss = winsVsRace.Protoss.text;
    stats.Zerg = winsVsRace.Zerg.text;
    stats.Terran = winsVsRace.Terran.text;
    stats.Random = winsVsRace.Random.text;
}

</script>

<style scoped>
.abandoned-games,
.raceStats,
.characterDetailsSection {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0 0 15px;
}

.character-stats-panel {
    flex: 0 1 auto;
    min-width: 500px;
    max-width: 800px;

    > div {
        margin-bottom: 65px;
    }
}

.winrate-block {
    display: flex;
    align-items: center;
    gap: 40px;

    .winrate-title {
        margin-bottom: 20px;
    }

    .winrate-block-main-race-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .winrate-block-offraces-container {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        align-items: center;
        justify-content: center;

        .winrate-block-offraces-items {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
        }
    }

    .winrate-inner {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: inherit;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 50%;
            opacity: 0.6;
        }

        .winrate-value,
        .winrate-sub {
            z-index: 1;
            color: #ffffff;
            font-weight: 700;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        }

        .winrate-value {
            letter-spacing: -0.5px;
        }

        .winrate-sub {
            margin-left: 1px;
        }
    }

    .winrate-inner-main .winrate-value {
        font-size: 1.50rem;
    }

    .winrate-inner-offrace .winrate-value {
        font-size: 1.25rem;
    }

    /* Target Vuetify's internal DOM */
    :deep(.v-progress-circular__overlay) {
        transition: none !important;
    }
}
</style>
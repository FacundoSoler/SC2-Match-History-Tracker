<template>
    <div class="matchHistory">
        <h2 class="panel-title">Match History</h2>
        <div
            v-show="characterMatches"
            class="matchHistoryList"
        >
            
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
                <tbody v-for="match in characterMatches">
                    <tr :class="{
                        'abandoned-game': isAbandonedGame(match)
                    }">
                        <td>{{ match.duration }}</td>
                        <td>{{ match.map }}</td>
                        <td :class="getOutcomeCSSClass(match, props.characterDetails)">{{ setOutcome(match,
                            props.characterDetails) }}
                        </td>
                        <td>
                            <img
                                v-if="match.players[0]"
                                :src="getRaceIcon(match.players[0].race)"
                                :alt="match.players[0].race"
                                width="16"
                                height="16"
                            />
                            {{ displayPlayerName(match.players[0]) }}
                        </td>
                        <td>
                            <img
                                v-if="match.players[1]"
                                :src="getRaceIcon(match.players[1].race)"
                                :alt="match.players[1].race"
                                width="16"
                                height="16"
                            />
                            {{ displayPlayerName(match.players[1]) }}
                        </td>
                        <td>
                            {{ DateFormatter.matchHistoryDateDiff(new Date(match.datetime), new Date()) }}
                            - {{ DateFormatter.formatDateTimeLocal(match.datetime) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { displayPlayerName, getOutcomeCSSClass, getRaceIcon, setOutcome } from '../utils/formatter';
import { DateFormatter } from '../utils/dateFormatter';

const props = defineProps<{
    characterId: number,
    characterDetails: any
    characterMatches: any
}>();

onMounted(() => {
});

const ABANDONED_GAME_THRESHOLD_IN_SECONDS = 60;

function isAbandonedGame(match: any) {
    const isAbandonedGame =
        (match.durationSeconds
            && match.players[0]?.displayName === props.characterDetails.tag
            && match.durationSeconds < ABANDONED_GAME_THRESHOLD_IN_SECONDS)
        && match.players[0].decision === 'LOSS';

    return isAbandonedGame;
}

</script>
<style scoped>
.matchHistory {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  align-items: center;
}

.matchHistoryList {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

thead td {
  position: sticky;
  top: 0;
  background-color: #272727;
  z-index: 1;
}

.abandoned-game {
    background-color: rgb(109 12 12);
}

.matchWon {
    color: rgb(8, 163, 8);
}

.matchLost {
    color: rgb(196, 9, 9);
}
</style>
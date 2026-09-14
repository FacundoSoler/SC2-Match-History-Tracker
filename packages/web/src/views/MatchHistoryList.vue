<template>
    <div class="matchHistory">
        <div
            v-show="characterMatches"
            class="matchHistoryList"
        >
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
                <tbody v-for="match in characterMatches">
                    <tr :class="{
                        'abandoned-game': isAbandonedGame(match)
                    }">
                        <td>{{ match.duration }}</td>
                        <td>{{ match.map }}</td>
                        <td :class="{
                            matchWon: match.players[0]?.displayName === props.characterDetails.name
                                && match.players[0].decision === 'WIN',
                            matchLost: match.players[0]?.displayName === props.characterDetails.name
                                && match.players[0].decision === 'LOSS'
                        }">{{ setOutcome(match) }}
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

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { displayPlayerName, getRaceIcon, showMMRchange } from '../utils/formatter';
import { DateFormatter } from '../utils/dateFormatter';

const props = defineProps<{
    characterId: string,
    characterDetails: any
    characterMatches: any
}>();

onMounted(() => {
    console.log('CharDETAILS', props.characterDetails);
    console.log('Matches', props.characterMatches);
});

const ABANDONED_GAME_THRESHOLD_IN_SECONDS = 60;

function setOutcome(match: any) {
    if (match.players[0]?.characterName === props.characterDetails.name) {
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
            && match.players[0]?.displayName === props.characterDetails.tag
            && match.durationSeconds < ABANDONED_GAME_THRESHOLD_IN_SECONDS)
        && match.players[0].decision === 'LOSS';

    return isAbandonedGame;
}
</script>
<style scoped>
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
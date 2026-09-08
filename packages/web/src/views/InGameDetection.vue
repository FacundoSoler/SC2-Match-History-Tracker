<template>
    <div class="main-container">
        <table>
            <tbody>
                <tr>
                    <td><label for=""><b>Status:</b> </label></td>
                    <td>{{ statusLabel }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const status = ref('OFFLINE');
const statusLabel = ref('Waiting for Starcraft 2 to run ...');

onMounted(async () => {
    try {
       // pingGame();
    } catch (error) {
        console.error('Error fetching SC2 in-game data', error);
    }
});

function pingGame() {
    setInterval(fetchGameData, 1000);
}

async function fetchGameData() {
    const SC2_INGAME_API_BASE_URL = 'http://localhost:6119/game';

    const response = await fetch(SC2_INGAME_API_BASE_URL);
    if (!response.ok) {
        throw new Error('Error fetching SC2 in-game details. Make sure Starcraft 2 is running .. !');
    }

    const data = await response.json();
    if (!data && !data.players) throw new Error('Error parsing SC2 in-game data');

    statusLabel.value = 'Starcraft 2 is running ... waiting for game ... ';
    status.value = 'ONLINE';

    console.log('SC2 In-Game data', data);
    console.log(status.value);
}
</script>
<style scoped>
.main-container {
    margin: 20px;
    display: flex;
    justify-content: center;
}

table {
    border-collapse: collapse;
}

tbody>tr,
td {
    border: beige 1px solid;
}
</style>
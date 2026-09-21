<template>
    <router-link
        class="back-link"
        to="/"
    >
        <v-icon
            class="back-icon"
            icon="mdi-arrow-left"
            size="18"
        />
        <span>Character Search</span>
    </router-link>

    <div class="main-content">
        <MatchHistoryWrapper
            :character-id="props.characterId"
            :season-id="props.seasonId"
        >
        </MatchHistoryWrapper>
    </div>
</template>

<script setup lang="ts">
import MatchHistoryWrapper from './MatchHistoryWrapper.vue';

const props = defineProps<{
    characterId: number,
    seasonId: number
}>();


</script>
<style>
html {
    background-color: rgba(29, 29, 36, 0.904);
    color: rgb(191, 192, 192);
    margin: 15px;
    overflow-y: hidden !important;
}

h2 {
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
    height: 100%;
    min-height: 0;
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
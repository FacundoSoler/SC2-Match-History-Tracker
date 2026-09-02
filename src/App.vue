<script setup lang="ts">
import CharacterSearch from './views/CharacterSearch.vue';

</script>

<template>
    <router-view v-slot="{ Component }">
        <keep-alive include="CharacterSearch">
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
</template>
<script setup lang="ts">
import CharacterSearch from './views/CharacterSearch.vue';
import AppNavBar from './views/AppNavBar.vue';

</script>

<template>
    <div class="page-layout">
        <AppNavBar />
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <keep-alive include="CharacterSearch">
                    <component :is="Component"></component>
                </keep-alive>
            </router-view>
        </main>
        <footer>Ver 1.0.3 - Created by Facundo Soler. 2026 All rights reserved.
            <!-- Privacy Policy Link -->
            <router-link
                to="/privacy"
                class="footer-link"
            >
                Privacy Policy
            </router-link>
        </footer>
    </div>

</template>
<style scoped>
.page-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: hidden;
}

footer {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    margin: 5px 0px 5px 0px;
    background-color: rgb(39, 37, 37);
}

.footer-link {
    color: #526af0;
    text-decoration: none;
    transition: color 0.2s ease;
    margin-left: 20px;
}

.footer-link:hover {
    color: #ffffff;
    text-decoration: underline;
}
</style>
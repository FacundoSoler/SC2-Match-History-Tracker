<script setup lang="ts">
import CharacterSearch from './views/CharacterSearch.vue';

</script>

<template>
    <div class="page-layout">
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <keep-alive include="CharacterSearch">
                    <component :is="Component"></component>
                </keep-alive>
            </router-view>
        </main>
        <footer>Ver 1.0.3 - Created by Facundo Soler. 2026 All rights reserved.</footer>
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
  margin: 10px 0px 20px 0px;
}
</style>
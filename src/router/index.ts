import { createRouter, createWebHistory } from "vue-router";
import CharacterSearch from "../views/CharacterSearch.vue";
import MatchHistory from "../views/MatchHistory.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "search", component: CharacterSearch },
    {
      path: "/matches/:characterId",
      name: "matches",
      component: MatchHistory,
      props: true,
    },
  ],
});

export default router;
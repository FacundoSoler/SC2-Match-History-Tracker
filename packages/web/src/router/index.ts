import { createRouter, createWebHistory } from "vue-router";
import CharacterSearch from "../views/CharacterSearch.vue";
import MatchHistory from "../views/MatchHistory.vue";
import InGameDetection from "../views/InGameDetection.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", 
      name: "search", 
      component: CharacterSearch 
    },
    {
      path: "/matches/:characterId/:seasonId",
      name: "matches",
      component: MatchHistory,
      props: true,
    },
    {
      path: "/ingamedetection",
      name: "ingamedetection",
      component: InGameDetection,
      props: true,
    },
  ],
});

export default router;
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import VueDevtools from "vite-plugin-vue-devtools";

export default defineConfig({
  build: {
    sourcemap: "inline",
  },
  test: {
    fileParallelism: false,
    pool: "forks",
    isolate: false,
    maxWorkers: 1,
  },
  plugins: [
    vue(),
    VueDevtools(),
    vuetify({ autoImport: true }),
  ],
});
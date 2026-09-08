import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: { mdi },
    },
})

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');
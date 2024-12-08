import "./assets/styles/main.scss";
import "@fontsource-variable/dm-sans";
import "primeicons/primeicons.css";

import { Tooltip as libTooltip } from "./lib/Tooltip";

import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import { Noir } from "./assets/preset";
import App from "./App.vue";
import Tooltip from "primevue/tooltip";

import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            cssLayer: {
                name: "primevue",
                order: "tailwind-base, primevue, tailwind-utilities",
            },
            darkModeSelector: ".dark-mode",
        },
    },
    ripple: true,
});

app.directive("tooltip", Tooltip);
app.directive("tip", libTooltip);

app.mount("#app");

import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import VueRouter from "unplugin-vue-router/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VueRouter({
            /* options */
        }),
        vue(),
        Components({
            resolvers: [PrimeVueResolver()],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "moden-compiler",
                quietDeps: true,
                silenceDeprecations: ["slash-div", "legacy-js-api"],
            },
            scss: {
                api: "moden-compiler",
                quietDeps: true,
                silenceDeprecations: ["slash-div", "legacy-js-api"],
            },
        },
    },
});

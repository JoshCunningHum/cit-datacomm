<script setup lang="ts">
import { menus } from "@/constants/menu";
import { tt } from "@/lib/Tooltip";
</script>

<template>
    <Fill center flex-col id="root">
        <h2>Data Communication and Networking Tool</h2>
        <div id="topic-grid">
            <RouterLink
                v-for="item in menus"
                :key="item.name"
                v-tip="tt(item.tooltip || '')"
                :to="item.route"
            >
                <i :class="item.icon" class="pi" />
                <span>{{ item.name }}</span>
            </RouterLink>
        </div>
        <PoweredByVue />
    </Fill>
</template>

<style lang="scss" scoped>
#root {
    @apply max-w-3xl mx-auto space-y-8;

    h2 {
        @apply text-4xl font-bold text-center py-4;
    }

    #topic-grid {
        @apply w-full;
        @apply py-2 px-8;
        @apply flex flex-wrap gap-4 justify-center;

        & > a {
            @apply border border-surface-700 rounded-lg;
            @apply basis-32 aspect-square px-2 cursor-pointer;
            @apply flex flex-col items-center justify-center;
            @apply hover:bg-surface-700;

            i {
                @apply text-3xl;
            }

            span {
                @apply text-sm text-center;
            }
        }
    }
}
</style>

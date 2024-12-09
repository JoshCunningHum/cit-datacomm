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
                :to="item.route as any"
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
    @apply mx-auto max-w-3xl space-y-8;

    h2 {
        @apply py-4 text-center text-4xl font-bold;
    }

    #topic-grid {
        @apply w-full;
        @apply px-8 py-2;
        @apply flex flex-wrap justify-center gap-4;

        & > a {
            @apply rounded-lg border border-surface-700;
            @apply aspect-square basis-32 cursor-pointer px-2;
            @apply flex flex-col items-center justify-center;
            @apply hover:bg-surface-700;

            i {
                @apply text-3xl;
            }

            span {
                @apply text-center text-sm;
            }
        }
    }
}
</style>

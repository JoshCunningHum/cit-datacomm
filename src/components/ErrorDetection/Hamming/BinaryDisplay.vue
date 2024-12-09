<script setup lang="ts">
const {
    data,
    errors = [],
    highlight = [],
} = defineProps<{
    data: string;
    highlight?: number[];
    errors?: number[];
    indexes?: number[];
    noHint?: boolean;
}>();
</script>

<template>
    <div class="group">
        <ScrollPanel
            :style="`width: 100%; height: ${40 + (noHint ? 5 : 10)}px`"
            class="relative"
            pt:content:class="!pb-0 !pr-0"
            pt:barX:class="bg-primary-500 h-0.5"
        >
            <div class="flex w-full min-w-max justify-center gap-3">
                <div
                    class="bit"
                    v-for="(c, i) in data"
                    :key="i"
                    :class="{
                        highlighted: highlight.includes(data.length - i),
                        error: errors.includes(data.length - i),
                    }"
                >
                    <div class="value">{{ c }}</div>
                    <div class="index">
                        {{ indexes ? indexes[i] : data.length - i }}
                    </div>
                </div>
                <div class="px-2"></div>
            </div>
        </ScrollPanel>
        <small
            class="invisible text-muted-color group-hover:visible"
            v-if="!noHint"
        >
            Shift + Scroll to scroll
        </small>
    </div>
</template>

<style lang="scss" scoped>
.bit {
    @apply w-6 flex-shrink-0;
    @apply text-center;

    .value {
        @apply w-full;
        @apply text-xl;
        @apply border-b border-surface-400;
    }

    .index {
        @apply h-2 text-xs text-muted-color;
    }

    &.highlighted {
        @apply text-primary-emphasis-alt;

        .value {
            @apply border-primary-emphasis;
        }

        .index {
            @apply text-primary;
        }
    }

    &.error {
        @apply text-red-400 !important;

        .value {
            @apply border-red-500 !important;
        }

        .index {
            @apply text-red-600 !important;
        }
    }
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import Hotkey from "../../components/Hotkey.vue";
import { type SidebarItem } from "./types";
import { tt } from "../Tooltip";
import { RouterLink } from "vue-router";

const props = defineProps<{
    item: string | number | SidebarItem;
}>();

const label = computed(() => {
    const { item } = props;
    if (typeof item === "string") return item;
    if (typeof item === "number") return item.toString();
    return item.label || item.name;
});

const tooltip = computed(() => {
    const { item } = props;
    if (typeof item === "string") return "";
    if (typeof item === "number") return "";
    return {
        text: item.tooltip || "",
        hotkey: item.hotkey,
    };
});

const route = computed(() => {
    const { item } = props;
    if (typeof item !== "object") return undefined;
    return item.route as string;
});
</script>

<template>
    <RouterLink
        :to="route || ''"
        v-tip="tt(tooltip)"
        class="hover:bg-surface-700 flex cursor-pointer select-none items-center rounded bg-inherit p-3"
        v-ripple
    >
        <template v-if="typeof item === 'number' || typeof item === 'string'">
            <div class="label">
                {{ label }}
            </div>
        </template>
        <template v-else>
            <i class="pi text-xl" :class="item.icon" />
            <span class="label flex gap-2">
                <span>{{ label }}</span>
                <Hotkey
                    v-if="!!item.hotkey"
                    :hotkey="item.hotkey"
                    prevent-default
                />
            </span>
        </template>
    </RouterLink>
</template>

<style lang="scss" scoped>
.pi,
.label {
    @apply text-surface-400;
}

.label {
    @apply w-0 overflow-hidden font-semibold transition-all group-hover:w-40 group-hover:pl-3 truncate;
}

.selected {
    @apply bg-surface-600/60 text-surface-200 hover:bg-surface-600;

    .pi,
    .label {
        @apply text-surface-200;
    }
}
</style>

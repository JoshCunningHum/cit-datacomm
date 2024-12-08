<script setup lang="ts" generic="T extends string | number | SidebarItem">
import { useArrayFilter } from "@vueuse/core";
import { computed, toRefs } from "vue";
import { useRoute } from "vue-router";
import Item from "./Item.vue";
import { type SidebarItem } from "./types";

const model = defineModel<T>({ required: false });
const props = defineProps<{
    items: T[];

    // optional states
    noSelection?: false;
}>();

const { items } = toRefs(props);

// Find whats on top and whats in the bottom
const top_items = useArrayFilter(
    items,
    (item) => typeof item !== "object" || !item.last
);
const bottom_items = useArrayFilter(
    items,
    (item) => typeof item === "object" && !!item.last
);

// Get what is selected
const route = useRoute();
const selected = computed(() => {
    const { items } = props;
    const path = route.path;

    const object_items = items.filter((item) => typeof item === "object");

    // Prioritize the route
    const matches = object_items
        .map((item, i) => [item, i] as const)
        .filter(([item]) => item.route && path.startsWith(item.route));
    // Find the longest match
    const [_, match] = matches.reduce(
        ([len, ind], [item, i]) =>
            len < (item.route?.length || 0)
                ? [item.route?.length || 0, i]
                : [len, ind],
        [0, -1]
    );
    if (match !== -1) return match;

    // If no route match, then proceed with state
    const { value: chosen } = model;
    if (!chosen) return -1;
    if (typeof chosen === "string" || typeof chosen === "number") {
        return items.findIndex((str) => str === chosen);
    }
    const name = chosen.name;
    return object_items.findIndex((item) => item.name === name);
});
</script>

<template>
    <div class="relative h-full w-[55px] bg-inherit">
        <div
            class="border-surface-800 group absolute z-10 flex h-full flex-col border-r bg-inherit p-2"
        >
            <div class="flex flex-grow flex-col gap-2">
                <Item
                    v-for="(item, key) in top_items"
                    :key
                    :item
                    :class="{ selected: selected === key && !noSelection }"
                    @click="model = item"
                />
            </div>
            <div class="flex flex-col gap-2">
                <Item
                    v-for="(item, key) in bottom_items"
                    :key
                    :item
                    :class="{
                        selected:
                            selected === key + top_items.length && !noSelection,
                    }"
                    @click="model = item"
                />
            </div>
        </div>
    </div>
</template>

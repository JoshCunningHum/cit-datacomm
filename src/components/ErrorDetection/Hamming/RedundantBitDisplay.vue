<script setup lang="ts">
import {
    applyRedundancy,
    getEncodedLength,
    getRedundancyBitIndexes,
    getRowBits,
    simulateError,
} from "@/utils/hamming";
import { computed, ref, useId } from "vue";
import BinaryDisplay from "./BinaryDisplay.vue";
import { dec } from "@/utils/number-systems";

const { data, original } = defineProps<{
    data: string;
    original?: string;
}>();

const redundant_bits = computed(() => getRedundancyBitIndexes(data.length));
const encoded = computed(() => {
    const applied = applyRedundancy(data);
    if (!original) return applied;
    return simulateError(original, data);
});
const errors = computed(() => {
    if (!original) return [];
    const d = encoded.value;

    const m = getEncodedLength(data.length) - data.length;
    let erroneous = "";
    for (let i = m; i > 0; i--) {
        const { results } = getRowBits(d, i);
        const odd_parity = results.filter((d) => d === "1").length % 2 === 1;
        erroneous += odd_parity ? "1" : "0";
    }
    return [dec(erroneous, 2)];
});

// show original
const id = useId();
const show_og = ref(false);
</script>

<template>
    <div class="space-y-2 py-1 pt-2">
        <div class="space-x-2 text-sm">
            <Checkbox :input-id="id" binary v-model="show_og" />
            <label :for="id">Show Original</label>
        </div>
        <BinaryDisplay
            :data="show_og ? data : encoded"
            :highlight="show_og ? [] : redundant_bits"
            :errors
        />
    </div>
</template>

<style lang="scss" scoped></style>

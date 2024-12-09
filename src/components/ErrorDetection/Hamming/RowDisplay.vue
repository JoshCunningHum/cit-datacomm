<script setup lang="ts">
import {
    applyRedundancy,
    getRedundancyBitIndexes,
    getRowBits,
    simulateError,
} from "@/utils/hamming";
import { computed } from "vue";
import BinaryDisplay from "./BinaryDisplay.vue";

const { data, original } = defineProps<{
    data: string;
    original?: string;
}>();

const rows = computed(() => {
    const rb = getRedundancyBitIndexes(data.length);
    const encoded = original
        ? simulateError(original, data)
        : applyRedundancy(data);

    return rb.map((_, i) => {
        const { results: bits, indexes } = getRowBits(encoded, i + 1);

        return {
            index: _,
            indexes,
            bits: bits.join(""),
            parity: bits.filter((d) => d === "1").length % 2,
        };
    });
});
</script>

<template>
    <div class="pb-2">
        <ScrollPanel
            style="width: 100%; height: 200px"
            class="relative"
            pt:content:class="!pb-0 !pr-0"
            pt:barX:class="bg-primary-500 h-0.5"
            pt:barY:class="bg-primary-500 w-0.5"
        >
            <div class="space-y-1 pb-2 pr-7">
                <div v-for="(row, i) in rows" class="row" :key="i">
                    <div class="row-number">R{{ i + 1 }}</div>
                    <BinaryDisplay
                        class="flex-shrink"
                        :data="row.bits"
                        :indexes="row.indexes"
                        :highlight="[row.bits.length]"
                        no-hint
                    />
                    <div
                        class="row-result"
                        :class="{
                            danger: row.parity === 1,
                            success: row.parity === 0,
                        }"
                    >
                        {{ row.parity }}
                    </div>
                </div>
            </div>
        </ScrollPanel>
    </div>
</template>

<style lang="scss" scoped>
.row {
    @apply flex items-center;

    .row-number {
        @apply flex flex-shrink-0 items-center justify-center;
        @apply size-10 rounded-md;
        @apply bg-emphasis;
    }

    .row-result {
        @apply text-xl;
        @apply ml-auto;

        &.danger {
            @apply text-red-500;
        }

        &.success {
            @apply text-primary;
        }
    }
}
</style>

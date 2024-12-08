<script setup lang="ts">
import { tt } from "@/lib/Tooltip";
import { SubnetMask } from "@/utils/subnet-mask";
import { bin } from "@/utils/number-systems";
import { get, syncRef } from "@vueuse/core";
import { computed } from "vue";

const model = defineModel<string>({ default: "255.255.255.0" });
const slashed = defineModel<number>("slash", { default: 24 });

syncRef(model, slashed, {
    transform: {
        ltr: (mask) => SubnetMask.from(mask).slash,
        rtl: (slash) => SubnetMask.fromSlash(slash).value,
    },
});

const binary_notation = computed(() =>
    get(model)
        .split(".")
        .map((d) => bin(d, 10).padStart(8, "0")),
);

const network_class = computed(() => ~~(get(slashed) / 8));
</script>

<template>
    <IftaLabel>
        <div
            class="rounded-lg border border-surface-600 bg-surface-950 px-2 pb-4 pt-6"
        >
            <div class="flex pb-4">
                <div
                    v-for="(d, key) in binary_notation.flatMap((d) =>
                        d.split(''),
                    )"
                    :key
                    @click="slashed = key + 1"
                    class="mask-bits"
                    :class="{
                        dotted: key % 8 === 0 && key !== 0,
                        'text-surface-600': d === '0',
                    }"
                    v-tip="tt(SubnetMask.fromSlash(key + 1).value)"
                >
                    {{ d }}
                </div>
            </div>
            <Slider
                :min="1"
                :max="32"
                :step="1"
                v-model="slashed"
                class="ml-4 mr-2"
                pt:handle:class="size-3.5 before:content-none -mt-2 border-2 border-primary-400 !bg-surface-700"
                v-tip="
                    tt(
                        'You can click on the individual bits above to set the mask.',
                    )
                "
            />
            <div class="flex justify-end px-2 pt-3 font-mono">
                <span class="mr-auto text-muted-color">
                    Network Class
                    {{
                        ["¯\\_(ツ)_/¯", "A", "B", "C", "Single"][network_class]
                    }}
                </span>
                {{ model }}
                <span class="text-primary">/{{ slashed }}</span>
            </div>
        </div>
        <label>Subnet Mask</label>
    </IftaLabel>
</template>

<style lang="scss" scoped>
.mask-bits {
    @apply flex-1 cursor-pointer select-none text-center font-mono text-sm hover:bg-surface-600/50;

    &.dotted {
        @apply relative flex items-center justify-center border-l;
    }
}
</style>

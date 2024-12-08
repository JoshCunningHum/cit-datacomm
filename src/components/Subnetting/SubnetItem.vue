<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from "vue";
import type { Subnet } from "./SubnetOutput.vue";
import { set, useElementSize } from "@vueuse/core";
import { IP } from "@/utils/ip";
import { SubnetMask } from "@/utils/subnet-mask";
import CopyWrapper from "../CopyWrapper.vue";

const { data } = defineProps<{
    data: Subnet;
    injectHeight?: boolean;
}>();

// Computed properties
const firstIP = computed(() => IP.from(data.network).next().value);
const lastIP = computed(() => IP.from(data.broadcast).next(-1).value);
const maskSlash = computed(() => SubnetMask.from(data.mask).slash);

// Item height calibration
const root = useTemplateRef("root");
const { height } = useElementSize(root);

const updateHeight = inject("update-height", (n: number) => {});
onMounted(() => updateHeight(height.value));
</script>

<template>
    <div ref="root" class="root" :class="{ current: data.current }">
        <div class="flex justify-between text-xs text-muted-color">
            <span>
                Subnet #{{ data.no + 1 }} - {{ data.hosts - 2 }} hosts
                <span v-if="data.current" class="ml-2 text-primary"
                    >Current IP</span
                >
            </span>

            <span>
                {{ data.mask }}
                <span class="text-primary">/{{ maskSlash }}</span>
            </span>
        </div>
        <div class="data-container">
            <div>
                <div>
                    <strong>Network IP:</strong>
                    <CopyWrapper :text="data.network">
                        <pre>{{ data.network }}</pre>
                    </CopyWrapper>
                </div>
                <div>
                    <strong>Broadcast IP:</strong>
                    <CopyWrapper :text="data.broadcast">
                        <pre>{{ data.broadcast }}</pre>
                    </CopyWrapper>
                </div>
            </div>
            <div>
                <div>
                    <strong>First Host:</strong>
                    <CopyWrapper :text="firstIP">
                        <pre>{{ firstIP }}</pre>
                    </CopyWrapper>
                </div>
                <div>
                    <strong>Last Host:</strong>
                    <CopyWrapper :text="lastIP">
                        <pre>{{ lastIP }}</pre>
                    </CopyWrapper>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.root {
    @apply cursor-pointer;
    @apply mb-2 px-3 py-2;
    @apply rounded;
    @apply bg-emphasis hover:bg-surface-700;

    &.current {
        @apply bg-highlight;
    }

    .data-container {
        @apply flex;

        & > * {
            @apply flex-1;

            & > * {
                @apply flex gap-4 text-right;

                & > * {
                    @apply flex-1;
                }

                strong {
                    @apply text-muted-color;
                }
            }
        }
    }
}
</style>

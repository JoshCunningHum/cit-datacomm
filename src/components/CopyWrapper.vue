<script setup lang="ts">
import { copyString } from "@/lib/utils/copyString";
import { refAutoReset, set } from "@vueuse/core";

const { text } = defineProps<{
    text: string;
}>();

const copied = refAutoReset(false, 750);

const copy = () => {
    copyString(text).then(() => set(copied, true));
};
</script>

<template>
    <div class="__copier" :class="{ copied }" @click="copy" v-ripple>
        <slot v-if="!copied"></slot>
        <div v-else class="sign">
            <div>Successfully Copied</div>
            <i class="pi pi-check" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.__copier {
    @apply text-center;

    &.copied {
        @apply flex items-center;
    }

    .sign {
        @apply flex items-center gap-2;
        font-size: x-small;
    }
}
</style>

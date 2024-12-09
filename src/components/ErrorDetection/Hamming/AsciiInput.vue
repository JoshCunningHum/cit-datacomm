<script setup lang="ts">
import capitalize from "@/lib/utils/capitalize";
import { asciiToBin, binToAscii } from "@/utils/ascii";
import { get, set } from "@vueuse/core";
import { computed, ref } from "vue";

const input = defineModel<string>({ default: "" });

const mode = ref<"binary" | "ascii">("ascii");
const toggle_mode = () => set(mode, get(mode) === "ascii" ? "binary" : "ascii");

const displayed = computed({
    get: () => {
        const m = mode.value;
        return m === "ascii" ? binToAscii(input.value) : input.value;
    },
    set: (v) => {
        const m = mode.value;
        set(input, m === "binary" ? v.replaceAll(/\s+/g, "") : asciiToBin(v));
    },
});

const keyfilter = computed(() => (mode.value === "binary" ? /[0-1]/ : /./));
</script>

<template>
    <InputGroup>
        <InputText
            v-model="displayed"
            v-keyfilter="keyfilter"
            :placeholder="`Enter ${mode === 'binary' ? 'binary' : 'text'} message...`"
        />
        <Button :label="capitalize(mode)" @click="toggle_mode" />
    </InputGroup>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { InputText } from "primevue";
import { computed } from "vue";

const ip = defineModel<string>({ default: "" });
const is_ip_valid = computed(() => {
    const sections = ip.value.split(".");
    if (sections.length < 4) return false;
    return sections.every((n) => parseInt(n) < 256);
});
</script>

<template>
    <InputText
        v-model="ip"
        placeholder="Enter a valid IP"
        class="font-mono"
        :invalid="!is_ip_valid"
        v-keyfilter="{
            pattern: /^(\d{1,3})?(\.\d{0,3}){0,3}$/,
            validateOnly: true,
        }"
    />
</template>

<style lang="scss" scoped></style>

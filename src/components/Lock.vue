<script setup lang="ts">
const locked = defineModel<boolean>({ default: false });
</script>

<template>
    <ToggleButton
        on-icon="pi pi-lock"
        off-icon="pi pi-lock-open"
        pt:label:class="hidden"
        :class="{
            'before:bg-amber-600': locked,
        }"
        v-model="locked"
    />
</template>

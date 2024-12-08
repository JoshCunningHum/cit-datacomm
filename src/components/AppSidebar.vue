<script setup lang="ts">
import { menus } from "@/constants/menu";
import Sidebar from "@/lib/Sidebar/index.vue";
</script>

<template>
    <Sidebar :items="menus" class="bg-surface-800" />
</template>

<style lang="scss" scoped></style>

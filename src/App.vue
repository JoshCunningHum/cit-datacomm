<script setup lang="ts">
import AppSidebar from "./components/AppSidebar.vue";
import Tooltip from "./lib/Tooltip/component.vue";
</script>

<template>
    <Screen class="main">
        <AppSidebar />
        <RouterView />
        <Tooltip />
    </Screen>
</template>

<style lang="scss" scoped>
.main {
    @apply flex;
    @apply bg-surface-900 text-zinc-300;
}
</style>

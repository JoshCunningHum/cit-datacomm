<script setup lang="ts">
import Hamming from "@/components/ErrorDetection/Hamming.vue";
</script>

<template>
    <Tabs value="2" class="mx-auto w-full max-w-2xl">
        <TabList pt:activeBar:class="h-full bg-surface-700 rounded-t-md">
            <Tab
                v-ripple="false"
                class="z-10 flex-1 border-transparent py-1 text-white"
                value="0"
                >LRC</Tab
            >
            <Tab
                v-ripple="false"
                class="z-10 flex-1 border-transparent py-1 text-white"
                value="1"
                >CRC</Tab
            >
            <Tab
                v-ripple="false"
                class="z-10 flex-1 border-transparent py-1 text-white"
                value="2"
                >Hamming</Tab
            >
        </TabList>
        <TabPanels class="flex-1">
            <TabPanel value="0">
                <p>Hehe wala pa nahuman</p>
            </TabPanel>
            <TabPanel value="1">
                <p>Hehe wala pa nahuman</p>
            </TabPanel>
            <TabPanel value="2" class="h-full">
                <Hamming />
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>

<style lang="scss" scoped></style>

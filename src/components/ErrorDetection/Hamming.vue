<script setup lang="ts">
import { syncRef } from "@vueuse/core";
import { ref } from "vue";
import AsciiInput from "./Hamming/AsciiInput.vue";
import RedundantBitDisplay from "./Hamming/RedundantBitDisplay.vue";
import RowDisplay from "./Hamming/RowDisplay.vue";

const sent = ref<string>("");
const received = ref<string>("");

syncRef(sent, received, { direction: "ltr" });
</script>

<template>
    <div class="h-full">
        <small>Sent Message</small>
        <AsciiInput v-model="sent" />

        <template v-if="!!sent">
            <RedundantBitDisplay :data="sent" />
            <RowDisplay :data="sent" />

            <small class="flex justify-between">
                <span>Received Message</span>
                <span class="text-muted-color">
                    This will use the redundant bits in the sent message
                </span>
            </small>
            <AsciiInput v-model="received" />
            <template v-if="received.length === sent.length">
                <RedundantBitDisplay :data="received" :original="sent" />
                <RowDisplay :data="received" :original="sent" />
            </template>
            <Message severity="error" v-else class="mt-2">
                Recieved message should have the equal bit length with the sent
                message.
            </Message>
        </template>
    </div>
</template>

<style lang="scss" scoped></style>

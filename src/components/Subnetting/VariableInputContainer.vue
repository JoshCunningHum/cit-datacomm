<script setup lang="ts">
import { isPowerOf2, getNextPowerOf2 } from "@/utils/math";
import { get, set, syncRef, watchArray } from "@vueuse/core";
import { ref, watch } from "vue";

const ip = defineModel<string>("ip", { required: true });

const subnetLengths = defineModel<number[]>("lengths", { required: true });
const subnetShown = ref<number[]>([...subnetLengths.value]);

// Sorting the subnet
const subnetOrders = ["ASC", "DES"] as const;
const subnetOrder = ref<(typeof subnetOrders)[number]>("ASC");
const toggleOrder = () =>
    set(subnetOrder, get(subnetOrder) === "ASC" ? "DES" : "ASC");

const sortSubnets = () => {
    const ascending = subnetOrder.value === "ASC";
    const sorted = [...subnetLengths.value].sort((a, b) =>
        ascending ? a - b : b - a,
    );

    subnetLengths.value.splice(0, sorted.length, ...sorted);
    set(subnetShown, sorted);
};
const validateChips = (v: string[]) => {
    const sanitized = v
        .map((d) => parseInt(d))
        .filter((n) => !isNaN(n) && n > 0);
    subnetLengths.value.splice(0, sanitized.length, ...sanitized);
    sortSubnets();
};
watch(subnetOrder, sortSubnets);

// Chip formatter
const ensurePower = (n: number) => (isPowerOf2(n) ? n : getNextPowerOf2(n));
</script>

<template>
    <div class="space-y-2">
        <InputGroup>
            <IftaLabel>
                <AutoComplete
                    :model-value="subnetShown"
                    @update:model-value="validateChips"
                    @item-unselect="() => console.log('unselected!!!')"
                    @option-unselect="() => console.log('option!!!')"
                    multiple
                    fluid
                    :typeahead="false"
                    pt:inputMultiple:class="rounded-e-none"
                    option-label="thisistest"
                >
                    <template #chipicon="{ index, removeCallback }">
                        <div class="subnet-length-item">
                            <span>
                                {{ subnetShown[index] }}
                                <span
                                    v-if="!isPowerOf2(subnetShown[index])"
                                    class="text-muted-color"
                                >
                                    ({{ ensurePower(subnetShown[index]) }})
                                </span>
                            </span>
                            <i
                                class="pi pi-times-circle"
                                @click="
                                    (e) => {
                                        subnetShown.splice(index, 1);
                                        subnetLengths.splice(index, 1);
                                    }
                                "
                            />
                        </div>
                    </template>
                </AutoComplete>
                <label>Subnet host range</label>
            </IftaLabel>
            <Button :label="subnetOrder" @click="toggleOrder" />
        </InputGroup>
        <Message
            size="small"
            severity="secondary"
            variant="simple"
            class="pb-4"
        >
            Type a number and press enter to add it on the subnet length list
        </Message>

        <IftaLabel class="flex-1">
            <IpAddressInput class="w-full" v-model="ip" />
            <label>IP Address</label>
        </IftaLabel>
    </div>
</template>

<style lang="scss" scoped>
.subnet-length-item {
    @apply flex items-center gap-2;

    .pi {
        @apply cursor-pointer;
    }
}
</style>

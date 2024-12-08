<script setup lang="ts">
import Fill from "@/components/Fill.vue";
import FixedInputContainer from "@/components/Subnetting/FixedInputContainer.vue";
import SubnetOutput from "@/components/Subnetting/SubnetOutput.vue";
import VariableInputContainer from "@/components/Subnetting/VariableInputContainer.vue";
import { field } from "@/hooks/field";
import enumToArray from "@/lib/utils/enumToArray";
import { toRefs } from "@vueuse/core";
import { ref } from "vue";

enum HostRangeType {
    Fixed,
    Variable,
}
const descriptions = [
    "In a fixed IP host range, the subnet mask and network configuration are static and predetermined.",
    "In a variable IP host range, the subnet mask can be more flexible and dynamically adjusted.",
];
const warnings = {
    "no-rangetype": "Please select a range type",
};

const range_type = ref(HostRangeType.Fixed);
const range_types = enumToArray(HostRangeType);

const data = ref({
    mask: "255.255.255.0",
    ip: "",
    subnetCount: 1,
    ipPerSubnet: 256,
    subnetLengths: [],
});
const ip = field(data, "ip");
const subnetLengths = field(data, "subnetLengths");
</script>

<template>
    <Fill center>
        <div class="flex h-full max-h-[95vh] w-full max-w-2xl flex-col">
            <IftaLabel>
                <SelectButton
                    class="w-full pt-6"
                    :options="range_types"
                    :option-value="(v) => HostRangeType[v]"
                    v-model="range_type"
                />
                <label>Subnet host range</label>
            </IftaLabel>

            <small class="my-2">
                {{ descriptions[range_type] || warnings["no-rangetype"] }}
            </small>

            <FixedInputContainer
                v-model="data"
                v-if="range_type === HostRangeType.Fixed"
            />
            <VariableInputContainer
                v-model:ip="ip"
                v-model:lengths="subnetLengths"
                v-else-if="range_type === HostRangeType.Variable"
            />

            <SubnetOutput :data :fixed="range_type === HostRangeType.Fixed" />
        </div>
    </Fill>
</template>

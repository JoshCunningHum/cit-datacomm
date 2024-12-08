<script setup lang="ts">
import { tt } from "@/lib/Tooltip";
import { SubnetMask } from "@/utils/subnet-mask";
import { getNextPowerOf2, isPowerOf2 } from "@/utils/math";
import { get, reactify, set, toRefs, watchPausable } from "@vueuse/core";
import { nextTick, ref } from "vue";
import Lock from "../Lock.vue";
import SubnetMaskInput from "../SubnetMaskInput.vue";

interface Data {
    mask: string;
    ip: string;
    ipPerSubnet: number;
    subnetCount: number;
}
const data = defineModel<Data>({
    default: {
        mask: "255.255.255.0",
        ip: "",
        subnetCount: 1,
        ipPerSubnet: 256,
    },
});
const { ip, mask, subnetCount, ipPerSubnet } = toRefs(data);

const ensurePower = (n: number) => (isPowerOf2(n) ? n : getNextPowerOf2(n));

/*
    This function receives 3 (undefined-able) paramters on which only 1 of them should be undefined
    the undefined is then the value returned using this formula
    nIP (mask) = nS (subnet count) * IPS (ips per subnet) 
*/
const formula = (mask?: string, nS?: number, IPS?: number) => {
    // Make sure that there is only 1 undefined
    const undefines = [mask, nS, IPS].filter((n) => n === undefined);

    if (undefines.length !== 1) throw new Error("Formula lacking variables");

    // Ensures power
    if (IPS) IPS = ensurePower(IPS);

    if (!mask) {
        const range = nS! * IPS!;
        return SubnetMask.fromRange(range).value;
    } else {
        const nIP = SubnetMask.from(mask).range;
        return ~~(nIP / (nS ? ensurePower(nS) : IPS!));
    }
};

// Lock variables
const ipPerSubnetLock = ref(false);
const subnetCountLock = ref(true);

// Pausable watches
const createNoUpdates =
    (pause: Function, resume: Function) => (cb: Function) => {
        pause();
        nextTick()
            .then(() => cb())
            .then(() => resume());
    };

const { pause: maskPause, resume: maskResume } = watchPausable(mask, (mask) => {
    const ipsLock = get(ipPerSubnetLock);
    const nsLock = get(subnetCountLock);
    const nS = subnetCount.value;
    const IPS = ipPerSubnet.value;

    if (nsLock && ipsLock) set(ipPerSubnetLock, false);

    if (!nsLock) {
        scNoUpdate(() => set(subnetCount, formula(mask, undefined, IPS)));
    } else {
        ipsNoUpdate(() => set(ipPerSubnet, formula(mask, nS, undefined)));
    }
});
const maskNoUpdate = createNoUpdates(maskPause, maskResume);

const { pause: scPause, resume: scResume } = watchPausable(
    subnetCount,
    (subnetCount) => {
        const ipsLock = get(ipPerSubnetLock);
        const nIP = mask.value;
        const IPS = ipPerSubnet.value;

        subnetCount = ensurePower(subnetCount);

        if (ipsLock) {
            maskNoUpdate(() => set(mask, formula(undefined, subnetCount, IPS)));
        } else {
            ipsNoUpdate(() =>
                set(ipPerSubnet, formula(nIP, subnetCount, undefined)),
            );
        }
    },
);
const scNoUpdate = createNoUpdates(scPause, scResume);

const { pause: ipsPause, resume: ipsResume } = watchPausable(
    ipPerSubnet,
    (ipsPerSubnet) => {
        const nsLock = get(subnetCountLock);
        const nIP = mask.value;
        const nS = subnetCount.value;

        if (nsLock) {
            maskNoUpdate(() => set(mask, formula(undefined, nS, ipsPerSubnet)));
        } else {
            scNoUpdate(() =>
                set(subnetCount, formula(nIP, undefined, ipsPerSubnet)),
            );
        }
    },
);
const ipsNoUpdate = createNoUpdates(ipsPause, ipsResume);

// Tooltip
const locked_tooltip =
    "Locks the value so it won't get changed by other inputs";

// Input adjustments
const compEnsurePower = reactify(ensurePower);

const subnetCountAdj = compEnsurePower(subnetCount);
const ipPerSubnetAdj = compEnsurePower(ipPerSubnet);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <SubnetMaskInput class="w-full" v-model="mask" />

        <IftaLabel class="flex-1">
            <IpAddressInput class="w-full" v-model="ip" />
            <label>IP Address</label>
        </IftaLabel>

        <InputGroup class="flex-1">
            <IftaLabel>
                <InputNumber
                    v-tip="tt('The number of IP addresses per subnet')"
                    v-model="ipPerSubnet"
                />
                <label :class="{ highlight: ipPerSubnetLock }">
                    IPs Per Subnet
                </label>
            </IftaLabel>
            <InputGroupAddon
                class="border-r border-surface-600"
                v-if="ipPerSubnetAdj !== ipPerSubnet"
                v-tip="
                    tt('This is the adjusted value to be used in subnetting')
                "
            >
                <span>{{ ipPerSubnetAdj }}</span>
            </InputGroupAddon>
            <Lock
                v-model="ipPerSubnetLock"
                v-tip="ipPerSubnetLock && locked_tooltip"
            />
        </InputGroup>

        <InputGroup class="flex-1">
            <IftaLabel>
                <InputNumber v-model="subnetCount" />
                <label :class="{ highlight: subnetCountLock }">
                    No of Subnets
                </label>
            </IftaLabel>
            <InputGroupAddon
                v-if="subnetCountAdj !== subnetCount"
                class="border-r border-surface-600"
                v-tip="
                    tt('This is the adjusted value to be used in subnetting')
                "
            >
                <span>{{ subnetCountAdj }}</span>
            </InputGroupAddon>
            <Lock
                v-model="subnetCountLock"
                v-tip="subnetCountLock && locked_tooltip"
            />
        </InputGroup>

        <div></div>
    </div>
</template>

<style lang="scss" scoped>
label.highlight {
    @apply text-amber-500 !important;
}
</style>

<script setup lang="ts">
import { IP } from "@/utils/ip";
import { getNextPowerOf2, isPowerOf2 } from "@/utils/math";
import { SubnetMask } from "@/utils/subnet-mask";
import { set, toRefs, useElementSize } from "@vueuse/core";
import { computed, provide, ref, useTemplateRef } from "vue";
import SubnetItem from "./SubnetItem.vue";

const props = defineProps<{
    data: {
        mask: string;
        ip: string;
        ipPerSubnet: number;
        subnetCount: number;
        subnetLengths: number[];
    };
    fixed: boolean;
}>();

const data = computed(() => props.data);
const { ip, ipPerSubnet, mask, subnetCount, subnetLengths } = toRefs(data);

const isValid = computed(() => {
    if (!IP.isValid(ip.value)) return false;

    return true;
});

const ensurePower = (n: number) => (isPowerOf2(n) ? n : getNextPowerOf2(n));

// Subnets
export interface Subnet {
    network: string;
    broadcast: string;
    hosts: number;
    mask: string;
    no: number;
    current?: boolean;
}

const subnets = computed(() => {
    const results: Subnet[] = [];
    // Inputs
    const SM = new SubnetMask(mask.value);
    const Ip = new IP(ip.value);
    const IpN = Ip.N;

    const SL = subnetLengths.value;
    const IPS = ensurePower(ipPerSubnet.value);

    // # of subnets
    const nS = props.fixed ? ensurePower(subnetCount.value) : SL.length;
    const start = SM.apply(Ip.value);

    if (props.fixed) {
        for (let nSubnet = 0; nSubnet < nS; nSubnet++) {
            const jump = nSubnet * IPS;

            const network = start.next(jump);
            const broadcast = network.next(IPS - 1);

            results.push({
                network: network.value,
                broadcast: broadcast.value,
                hosts: IPS,
                mask: SM.value,
                no: nSubnet,
                current: network.N <= IpN && broadcast.N >= IpN,
            });
        }
    } else {
        for (const _sL of SL) {
            const sL = ensurePower(_sL);

            const mask = SubnetMask.fromRange(sL);
            const start = mask.apply(Ip.value);

            const prevS = results.at(-1);

            if (prevS) {
                const { broadcast, network } = prevS;
                const bN = new IP(broadcast).N;
                const nN = new IP(network).N;
                let startN = start.N;
                while (nN >= start.N || bN >= startN) {
                    start.add(sL);
                    startN = start.N;
                }
            }

            const broadcast = start.next(sL - 1);

            results.push({
                broadcast: broadcast.value,
                hosts: sL,
                mask: mask.value,
                network: start.value,
                no: results.length,
                current: start.N <= IpN && broadcast.N >= IpN,
            });
        }
    }

    return results;
});

// Sizing
const itemSize = ref(300);

const updateHeight = (v: number) => set(itemSize, v);
provide("update-height", updateHeight);
</script>

<template>
    <div v-if="isValid" class="flex-1 pt-2">
        <VirtualScroller :items="subnets" :item-size>
            <template #item="{ item, options: { first } }">
                <SubnetItem :data="item" :inject-height="first" />
            </template>
        </VirtualScroller>
    </div>
</template>

<style lang="scss" scoped></style>

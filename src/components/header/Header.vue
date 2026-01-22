<template>
    <UiFlex
        position="sticky"
        tag="header"
        align-items="center"
        gap="g16"
        width="wfull"
        padding-inline="p16"
        :class="{
            [$style.header]: true,
            [$style.headerShadow]: !isStickyFilters,
        }"
    >
        <h1 :class="$style.title">
            Афоризмы
        </h1>
        <Switch />
        <UiFlex gap="g8" :class="$style.additional">
            <Add v-if="authStoreVariable.isAuthorized" />
            <Settings />
        </UiFlex>
    </UiFlex>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { UiFlex } from 'turmag-vue-components';
import Add from '@/components/header/HeaderAdd.vue';
import Settings from '@/components/header/HeaderSettings.vue';
import Switch from '@/components/header/HeaderSwitch.vue';
import { useAuthStore } from '@/stores/useAuth.store';

const authStoreVariable = useAuthStore();
const isStickyFilters = useStorage('isAphorismsStickyFilters', false);
</script>

<style lang="scss" module>
    .header {
        top: 0;
        left: 0;
        z-index: 3;
        height: 60px;
        background-color: var(--background-color-default);
    }

    .headerShadow {
        box-shadow: 0 3px 2px 0 var(--background-color-shadow);
    }

    .title {
        margin-top: 10px;
        color: var(--color-text-default);
        font-size: 28px;
        font-weight: bold;
    }

    .additional {
        margin-left: auto;
    }
</style>

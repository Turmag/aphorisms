<template>
    <UiFlex
        position="sticky"
        tag="header"
        align-items="center"
        gap="g16"
        width="wfull"
        padding-inline="p16"
        bg="default"
        :class="{
            [$style.header]: true,
            [$style.headerShadow]: !isStickyFilters,
        }"
    >
        <UiText
            tag="h1"
            size="fs28"
            weight="fw700"
            :class="$style.title"
        >
            Афоризмы
        </UiText>
        <HeaderSwitch />
        <UiFlex gap="g8" :class="$style.additional">
            <HeaderAdd v-if="authStoreVariable.isAuthorized" />
            <HeaderSettings />
        </UiFlex>
    </UiFlex>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { UiFlex, UiText } from 'turmag-vue-components';
import HeaderAdd from '@/components/header/HeaderAdd.vue';
import HeaderSettings from '@/components/header/HeaderSettings.vue';
import HeaderSwitch from '@/components/header/HeaderSwitch.vue';
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
    }

    .headerShadow {
        box-shadow: 0 3px 2px 0 var(--background-color-shadow);
    }

    .title {
        margin-top: 10px;
    }

    .additional {
        margin-left: auto;
    }
</style>

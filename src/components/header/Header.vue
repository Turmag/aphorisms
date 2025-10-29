<template>
    <header :class="headerClasses">
        <h1 :class="$style.title">
            Афоризмы
        </h1>
        <Switch />
        <UiFlex gap="g8" :class="$style.additional">
            <Add v-if="authStoreVariable.isAuthorized" />
            <Settings />
        </UiFlex>
    </header>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { computed, useCssModule } from 'vue';
import Add from '@/components/header/HeaderAdd.vue';
import Settings from '@/components/header/HeaderSettings.vue';
import Switch from '@/components/header/HeaderSwitch.vue';
import { UiFlex } from '@/components/kit';
import { useAuthStore } from '@/stores/useAuth.store';

const authStoreVariable = useAuthStore();
const $style = useCssModule();
const isStickyFilters = useStorage('isAphorismsStickyFilters', false);

const headerClasses = computed(() => ({
    [$style.header]: true,
    [$style.headerShadow]: !isStickyFilters.value,
}));
</script>

<style lang="scss" module>
    .header {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
        height: 60px;
        padding-inline: 16px;
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

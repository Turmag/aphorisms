<template>
    <header :class="headerClasses">
        <h1 :class="$style.title">
            Афоризмы
        </h1>
        <div :class="$style.switchWrapper">
            <Switch />
        </div>
        <div :class="$style.additional">
            <Add v-if="authStoreVar.isAuthorized" />
            <Settings />
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, useCssModule } from 'vue';
import Switch from '@/components/header/Switch.vue';
import Add from '@/components/header/Add.vue';
import Settings from '@/components/header/Settings.vue';
import { useStorage } from '@vueuse/core';
import { authStore } from '@/store/auth';

const authStoreVar = authStore();
const $style = useCssModule();
const isStickyFilters = useStorage('isStickyFilters', false);

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
        width: 100%;
        height: 60px;
        background-color: var(--background-color);
        gap: 16px;
        padding-inline: 16px;
    }

    .headerShadow {
        box-shadow: 0 3px 2px 0 var(--shadow-color);
    }

    .title {
        margin-top: 10px;
        font-size: 28px;
        color: var(--color);
        font-weight: bold;
    }

    .additional {
        display: flex;
        gap: 8px;
        margin-left: auto;
    }
</style>

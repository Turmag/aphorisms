<template>
    <header :class="$style.header">
        <h1 :class="$style.title">
            Афоризмы
        </h1>
        <div :class="$style.switchWrapper">
            <Switch />
            <IconBase
                v-if="store.isSavedDarkMode"
                v-tooltip="'Вернуться к системной теме'"
                :class="$style.themeReset"
                width="10"
                height="10"
                viewBoxWidth="1920"
                viewBoxHeight="1920"
                style="min-width: 15px;"
                @click="resetStorageDarkMode"
            >
                <Reset />
            </IconBase>
        </div>
    </header>
</template>

<script setup lang="ts">
import Switch from '@/components/header/Switch.vue';
import IconBase from '@/components/IconBase.vue';
import Reset from '@/assets/icons/Reset.vue';
import { mainStore } from '@/store/main';
const store = mainStore();

const resetStorageDarkMode = () => {
    delete localStorage['aphorismsDarkMode'];
    store.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    store.isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    store.isSavedDarkMode = false;
};
</script>

<style lang="scss" module>
    .header {
        display: flex;
        gap: 16px;
        height: 60px;
    }

    .title {
        margin-top: 0;
        padding: 14px 0 0 16px;
        font-size: 28px;
        color: var(--color);
        font-weight: bold;
    }

    .switchWrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .themeReset {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        outline: none;
        color: var(--color);
        cursor: pointer;
        user-select: none;
    }
</style>

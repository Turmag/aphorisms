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
        <Settings />
    </header>
</template>

<script setup lang="ts">
import IconBase from '@/components/IconBase.vue';
import Reset from '@/assets/icons/Reset.vue';
import Switch from '@/components/header/Switch.vue';
import Settings from '@/components/header/Settings.vue';
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
        position: fixed;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        background-color: var(--background-color);
        gap: 16px;
        padding-inline: 16px;
        box-shadow: 0 3px 2px 0 var(--shadow-color);
    }

    .title {
        margin-top: 10px;
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

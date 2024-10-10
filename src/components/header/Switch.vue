<template>
    <div :class="$style.switchWrapper">
        <div :class="$style.switch">
            <label :class="$style.label">
                <input
                    :class="$style.input"
                    type="checkbox"
                    :checked="!store.isDarkMode"
                    @change="toggle"
                >
                <span :class="$style.slider" />
            </label>
        </div>

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
</template>

<script setup lang="ts">
import IconBase from '@/components/shared/IconBase.vue';
import Reset from '@/assets/icons/Reset.vue';
import { mainStore } from '@/store/main';
const store = mainStore();

const toggle = () => {
    const bodyClass = document.body.classList;
    bodyClass.contains('dark') ? bodyClass.remove('dark') : bodyClass.add('dark');
    store.isDarkMode = bodyClass.contains('dark');
    localStorage.setItem('aphorismsDarkMode', String(store.isDarkMode));
    store.isSavedDarkMode = true;
};

const resetStorageDarkMode = () => {
    delete localStorage['aphorismsDarkMode'];
    store.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    store.isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    store.isSavedDarkMode = false;
};
</script>

<style lang="scss" module>
    .switch {
        position: relative;
        width: 44px;
    }

    .label {
        position: absolute;
        top: -12px;
        width: 100%;
        height: 22px;
        border-radius: 50px;
        background-color: var(--color);
        cursor: pointer;
        user-select: none;
    }

    .input {
        position: absolute;
        display: none;
    }

    .slider {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50px;
        transition: 0.3s;
    }

    .slider::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        box-shadow: inset 4px -1px 0 0 var(--background-color);
        background-color: var(--color);
        transition: 0.3s;
    }

    input:checked ~ .slider::before {
        background-color: var(--background-color);
        transform: translateX(22px);
        box-shadow: none;
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

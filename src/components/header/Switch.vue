<template>
    <div :class="$style.switchWrapper">
        <div :class="$style.switch">
            <label :class="$style.label">
                <input
                    :class="$style.input"
                    type="checkbox"
                    :checked="!isDarkMode"
                    @change="toggle"
                >
                <span :class="$style.slider" />
            </label>
        </div>

        <SvgIcon
            v-if="isSavedDarkMode"
            v-tooltip="'Вернуться к системной теме'"
            :class="$style.themeReset"
            width="10"
            height="10"
            viewBoxWidth="1920"
            viewBoxHeight="1920"
            icon-name="reset"
            style="min-width: 15px;"
            @click="resetStorageDarkMode"
        />
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { mainStore } from '@/stores/main.store';

const store = mainStore();
const isDarkMode = useStorage(store.darkModeName, false);
const isSavedDarkMode = useStorage(store.savedDarkModeName, false);

const toggle = () => {
    const bodyClass = document.body.classList;
    bodyClass.contains('dark') ? bodyClass.remove('dark') : bodyClass.add('dark');
    isDarkMode.value = bodyClass.contains('dark');
    isSavedDarkMode.value = true;
};

const resetStorageDarkMode = () => {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    isSavedDarkMode.value = false;
};
</script>

<style lang="scss" module>
    .switchWrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

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
        background-color: var(--color);
        transition: 0.3s;
        box-shadow: inset 4px -1px 0 0 var(--background-color);
    }

    input:checked ~ .slider::before {
        background-color: var(--background-color);
        transform: translateX(22px);
        box-shadow: none;
    }

    .themeReset {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        color: var(--color);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>

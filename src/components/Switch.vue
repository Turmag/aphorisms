<template>
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
</template>

<script setup lang="ts">
import { mainStore } from '@/store/main';
const store = mainStore();

const toggle = () => {
    const bodyClass = document.body.classList;
    bodyClass.contains('dark') ? bodyClass.remove('dark') : bodyClass.add('dark');
    store.isDarkMode = bodyClass.contains('dark');
    localStorage.setItem('docsDarkMode', String(store.isDarkMode));
    store.isSavedDarkMode = true;
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
        background-color: var(--color);
        border-radius: 50px;
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
        box-shadow: inset 4px -1px 0px 0px var(--background-color);
        background-color: var(--color);
        transition: 0.3s;
    }

    input:checked ~ .slider::before {
        transform: translateX(22px);
        box-shadow: none;
        background-color: var(--background-color);
    }
</style>

<template>
    <UiFlex
        justify-content="center"
        align-items="center"
        padding="p16"
        bg="button"
        radius="r16"
        :class="$style.button"
    >
        <slot />
    </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from '@/components/kit';
</script>

<style lang="scss" module>
    .button {
        box-sizing: border-box;
        min-width: 200px;
        height: 64px;
        color: var(--color-text-default);
        font-size: 24px;
        font-weight: 400;
        line-height: normal;
        transition: 0.3s ease;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--background-color-button-hover);
        }

        &:active {
            background-color: var(--background-color-button-active);
        }

        @media screen and (width <= 600px) {
            min-width: 170px;
            height: 40px;
            font-size: 20px;
        }
    }
</style>

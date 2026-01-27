<template>
    <UiFlex
        align-items="center"
        gap="g16"
        padding="p16"
        :class="{
            [$style.wrapper]: true,
            [$style.wrapperSticky]: isStickyFilters,
        }"
    >
        <input
            v-model="filterWord"
            :class="$style.filter"
            placeholder="Поиск"
            @input="onInput"
        >
        <SvgIcon
            :class="$style.cancel"
            width="20"
            height="20"
            :view-box-width="69"
            :view-box-height="69"
            icon-name="cancel"
            @click="resetFilter"
        />
        <UiCheckbox v-model="isStickyFilters">
            Липкий поиск
        </UiCheckbox>
    </UiFlex>
</template>

<script setup lang="ts">
import { useDebounceFn, useStorage } from '@vueuse/core';
import { UiFlex } from 'turmag-vue-components';
import { ref, watch } from 'vue';
import { SvgIcon, UiCheckbox } from '@/components/kit';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();
const isStickyFilters = useStorage('isAphorismsStickyFilters', false);

const filterWord = ref('');

const resetFilter = () => store.filterWord = '';
const onInput = useDebounceFn(() => store.filterWord = filterWord.value, 500);

watch(
    () => store.filterWord,
    value => filterWord.value = value,
);
</script>

<style lang="scss" module>
    .wrapper {
        z-index: 2;
        background-color: var(--background-color-default);
    }

    .wrapperSticky {
        position: sticky;
        top: 60px;
        left: 0;
        box-shadow: 0 3px 2px 0 var(--background-color-shadow);
    }

    .filter {
        box-sizing: border-box;
        width: 380px;
        height: 40px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--background-color-default);
        border: 1px solid #aaa;
        background: var(--background-color-default);
        color: var(--color-text-default);
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 16px;

        &::placeholder {
            color: #adadad;
        }
    }

    .cancel {
        color: var(--color-text-default);
        cursor: pointer;
        user-select: none;
    }
</style>

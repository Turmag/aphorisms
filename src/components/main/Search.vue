<template>
    <div :class="wrapperClasses">
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
        <Checkbox v-model="isStickyFilters">
            Липкий поиск
        </Checkbox>
    </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useStorage } from '@vueuse/core';
import {
    computed,
    ref,
    useCssModule,
    watch,
} from 'vue';
import Checkbox from '@/components/common/Checkbox.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { mainStore } from '@/store/main.store';

const store = mainStore();
const $style = useCssModule();
const isStickyFilters = useStorage('isStickyFilters', false);

const filterWord = ref('');

const wrapperClasses = computed(() => ({
    [$style.wrapper]: true,
    [$style.wrapperSticky]: isStickyFilters.value,
}));

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
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background-color: var(--background-color);
    }

    .wrapperSticky {
        position: sticky;
        top: 60px;
        left: 0;
        box-shadow: 0 3px 2px 0 var(--shadow-color);
    }

    .filter {
        box-sizing: border-box;
        width: 380px;
        height: 40px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--background-color);
        border: 1px solid #aaa;
        background: var(--background-color);
        color: var(--color);
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 16px;

        &::placeholder {
            color: #adadad;
        }
    }

    .cancel {
        color: var(--color);
        cursor: pointer;
        user-select: none;
    }
</style>

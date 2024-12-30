<template>
    <div :class="wrapperClasses">
        <input
            v-model="store.filterWord"
            :class="$style.filter"
            placeholder="Поиск"
        >
        <IconBase
            :class="$style.cancel"
            width="20"
            height="20"
            :view-box-width="69"
            :view-box-height="69"
            @click="resetFilter"
        >
            <Cancel />
        </IconBase>
        <Checkbox v-model="isStickyFilters">
            Липкий поиск
        </Checkbox>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { computed, useCssModule } from 'vue';
import { Cancel } from '@/assets/icons';
import Checkbox from '@/components/shared/Checkbox.vue';
import IconBase from '@/components/shared/IconBase.vue';
import { mainStore } from '@/store/main.store';

const store = mainStore();
const $style = useCssModule();
const isStickyFilters = useStorage('isStickyFilters', false);

const wrapperClasses = computed(() => ({
    [$style.wrapper]: true,
    [$style.wrapperSticky]: isStickyFilters.value,
}));

const resetFilter = () => store.filterWord = '';
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

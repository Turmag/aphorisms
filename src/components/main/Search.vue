<template>
    <div :class="$style.wrapper">
        <input v-model="store.filterWord" :class="$style.filter" placeholder="Поиск">
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
    </div>
</template>

<script setup lang="ts">
import IconBase from '@/components/IconBase.vue';
import Cancel from '@/assets/icons/Cancel.vue';
import { mainStore } from '@/store/main';
const store = mainStore();

const resetFilter = () => store.filterWord = '';
</script>

<style lang="scss" module>
    .wrapper {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-left: 16px;
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
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 16px;
        color: var(--color);

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

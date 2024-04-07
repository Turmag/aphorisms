<template>
    <main :class="$style.main">
        <Search />
        <div>
            <Blockquote
                v-for="(aphorism, i) in store.filteredAphorisms"
                :key="i"
                v-bind="aphorism"
            />
        </div>
    </main>
</template>

<script setup lang="ts">
import Search from '@/components/main/Search.vue';
import Blockquote from '@/components/main/Blockquote.vue';
import { mainStore } from '@/store/main';
const store = mainStore();
</script>

<style lang="scss" module>
    .main {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 60px;
        padding-top: 16px;
    }
</style>

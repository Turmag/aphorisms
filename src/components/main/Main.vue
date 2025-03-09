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
import Blockquote from '@/components/main/Blockquote.vue';
import Search from '@/components/main/Search.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();
</script>

<style lang="scss" module>
    .main {
        display: flex;
        flex-direction: column;
    }
</style>

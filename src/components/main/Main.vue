<template>
    <UiFlex tag="main" direction="col">
        <Search />
        <div>
            <Blockquote
                v-for="(aphorism, i) in store.filteredAphorisms"
                :key="i"
                v-bind="aphorism"
            />
        </div>
    </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'turmag-vue-components';
import Blockquote from '@/components/main/MainBlockquote.vue';
import Search from '@/components/main/MainSearch.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();
</script>

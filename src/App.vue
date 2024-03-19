<template>
    <Header />
    <div class="aphorisms">
        <Blockquote
            v-for="(aphorism, i) in store.aphorisms"
            :key="i"
            v-bind="aphorism"
            :numb="i + 1"
        />
    </div> 
</template>

<script setup lang="ts">
import Blockquote from '@/components/Blockquote.vue';
import Header from '@/components/Header.vue';
import { useTheme } from '@/assets/js/theme';
import { onMounted } from 'vue';
import { mainStore } from '@/store/main';

const store = mainStore();

useTheme();

onMounted(async () => {
    await store.getAphorisms();
    document.onclick = () => (store.unBlured = true);
});
</script>

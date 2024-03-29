<template>
    <Header />
    <Main />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
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

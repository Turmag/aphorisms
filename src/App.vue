<template>
    <Header />
    <Main />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { useTheme } from '@/assets/js/theme';
import { mainStore } from '@/store/main';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const store = mainStore();
const route = useRoute();

useTheme();

onMounted(async () => {
    await store.getAphorisms();
    store.scrollToChosenAphorism(route.query);
    document.onclick = () => store.unBlured = true;
});
</script>

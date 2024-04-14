<template>
    <Header />
    <Main />
    <notifications :duration="5000" :width="400" />
    <ModalsContainer />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { ModalsContainer } from 'vue-final-modal';
import { useTheme } from '@/assets/js/theme';
import { useScrollPosition } from '@/assets/js/scrollPosition';
import { mainStore } from '@/store/main';
import { authStore } from '@/store/auth';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const store = mainStore();
const authStoreVar = authStore();
const route = useRoute();

useTheme();
useScrollPosition();

onMounted(async () => {
    await authStoreVar.checkAuthorize();
    await store.getAphorisms();
    store.isLoadedPage = true;
    store.scrollToChosenAphorism(route.query);
    document.onclick = () => store.unBlured = true;
});
</script>

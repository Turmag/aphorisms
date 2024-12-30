<template>
    <Header />
    <Main />
    <notifications :duration="5000" :width="400" />
    <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import { useRoute } from 'vue-router';
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { useScrollPosition } from '@/shared/composables/useScrollPosition';
import { useTheme } from '@/shared/composables/useTheme';
import { authStore } from '@/store/auth';
import { mainStore } from '@/store/main';

const store = mainStore();
const authStoreVariable = authStore();
const route = useRoute();

useTheme();
useScrollPosition();

const init = async () => {
    await authStoreVariable.checkAuthorize();
    await store.getAphorisms();
    store.isLoadedPage = true;
    store.scrollToChosenAphorism(route.query);
    document.onclick = () => store.unBlured = true;
};

init();
</script>

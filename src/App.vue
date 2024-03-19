<template>
    <h1>Афоризмы</h1>
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
import { onMounted } from 'vue';
import { mainStore } from '@/store/main';
import Blockquote from '@/components/Blockquote.vue';

const store = mainStore();

onMounted(async () => {
    await store.getAphorisms();
    document.onclick = () => (store.unBlured = true);
});
</script>

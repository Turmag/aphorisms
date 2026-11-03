<template>
    <UiFlex tag="main" direction="col">
        <Search />
        <UiPagination
            v-model="store.itemsPerPage"
            :current-page="store.currentPage"
            :total="store.total"
            :disabled="store.isLoading"
            @update:current-page="store.changePage"
        />
        <p v-if="store.isLoading" role="status">
            Загрузка афоризмов…
        </p>
        <div v-else-if="store.loadError" role="alert">
            Не удалось загрузить афоризмы.
            <button type="button" @click="store.getAphorisms()">
                Повторить
            </button>
        </div>
        <p v-else-if="!store.total" role="status">
            Афоризмы не найдены
        </p>
        <div v-else>
            <Blockquote
                v-for="aphorism in store.aphorisms"
                :key="aphorism.id"
                v-bind="aphorism"
            />
        </div>
    </UiFlex>
</template>

<script setup lang="ts">
import { UiFlex } from 'turmag-vue-components';
import UiPagination from '@/components/kit/UiPagination.vue';
import Blockquote from '@/components/main/MainBlockquote.vue';
import Search from '@/components/main/MainSearch.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();
</script>

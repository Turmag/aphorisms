<template>
    <UiFlex tag="main" direction="col">
        <Search ref="search" />
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
        <div v-else-if="!store.total" :class="$style.empty">
            <div role="status">
                <h2 :class="$style.emptyTitle">
                    Ничего не найдено
                </h2>
                <p :class="$style.emptyText">
                    Попробуйте изменить запрос или сбросьте фильтры, чтобы увидеть все афоризмы.
                </p>
            </div>
            <UiButton @click="search?.resetFilters()">
                Сбросить фильтры
            </UiButton>
        </div>
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
import { useTemplateRef } from 'vue';
import { UiButton } from '@/components/kit';
import UiPagination from '@/components/kit/UiPagination.vue';
import Blockquote from '@/components/main/MainBlockquote.vue';
import Search from '@/components/main/MainSearch.vue';
import { useMainStore } from '@/stores/useMain.store';

const store = useMainStore();
const search = useTemplateRef('search');
</script>

<style lang="scss" module>
    .empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 24px;
        width: 100%;
        min-height: 320px;
        padding: 48px 24px;
        text-align: center;
    }

    .emptyTitle {
        margin: 0 0 12px;
        font-size: 28px;
        line-height: 1.3;
    }

    .emptyText {
        max-width: 440px;
        margin: 0;
        line-height: 1.6;
    }
</style>

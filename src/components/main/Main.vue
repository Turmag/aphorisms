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
        <div
            v-if="store.isLoading"
            :class="$style.loading"
            role="status"
            aria-label="Загрузка афоризмов"
        >
            <UiLoader :width="48" :height="48" />
        </div>
        <div v-else-if="store.loadError" :class="$style.state">
            <div role="alert">
                <h2 :class="$style.stateTitle">
                    Не удалось загрузить афоризмы
                </h2>
                <p :class="$style.stateText">
                    Попробуйте загрузить данные ещё раз.
                </p>
            </div>
            <UiButton @click="store.getAphorisms()">
                Загрузить ещё раз
            </UiButton>
        </div>
        <div v-else-if="!store.total" :class="$style.state">
            <div role="status">
                <h2 :class="$style.stateTitle">
                    Ничего не найдено
                </h2>
                <p :class="$style.stateText">
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
import { UiFlex, UiLoader } from 'turmag-vue-components';
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
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 320px;
        padding: 48px 24px;
    }

    .state {
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

    .stateTitle {
        margin: 0 0 12px;
        font-size: 28px;
        line-height: 1.3;
    }

    .stateText {
        max-width: 440px;
        margin: 0;
        line-height: 1.6;
    }
</style>

import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import {
    nextTick,
    ref,
    watch,
} from 'vue';
import { useSpecialToast } from '@/shared/composables/useSpecialToast';
import type { IAphorism } from '@/shared/types';
import type { AxiosError } from 'axios';
import Api from '@/shared/api/MainApi';

export const useMainStore = defineStore('main', () => {
    const { successToast, showError } = useSpecialToast();
    const isLoadedPage = ref(false);
    const aphorisms = ref<IAphorism[]>([]);
    const filterWord = ref('');
    const isSearchByNumber = ref(false);
    let isApplyingQuery = false;
    const currentPage = ref(1);
    const itemsPerPage = useStorage('aphorismsItemsPerPage', 50);
    if (![50, 100, 150, 200].includes(itemsPerPage.value)) itemsPerPage.value = 50;
    const total = ref(0);
    const isLoading = ref(false);
    const loadError = ref(false);
    let requestId = 0;
    const darkModeName = ref('isDarkModeAphorisms');
    const savedDarkModeName = ref('isSavedDarkModeAphorisms');
    const accessTokenName = ref('');
    const refreshTokenName = ref('');

    const getAphorisms = async () => {
        const id = ++requestId;
        isLoading.value = true;
        loadError.value = false;
        aphorisms.value = [];
        try {
            const { data } = await Api.getAphorisms({
                limit: itemsPerPage.value,
                page: currentPage.value,
                search: filterWord.value,
                searchByNumber: Number(isSearchByNumber.value),
            });
            if (id !== requestId) return;
            aphorisms.value = data.items;
            total.value = data.total;
            currentPage.value = data.page;
        } catch (error) {
            if (id !== requestId) return;
            loadError.value = true;
            showError(error, 'Загрузка афоризмов');
        } finally {
            if (id === requestId) isLoading.value = false;
        }
    };

    const loadFromQuery = async (phraseNumb?: string) => {
        isApplyingQuery = true;
        isSearchByNumber.value = phraseNumb !== undefined;
        filterWord.value = phraseNumb ?? '';
        currentPage.value = 1;
        await nextTick();
        isApplyingQuery = false;
        await getAphorisms();
    };

    const changePage = (page: number) => {
        currentPage.value = page;
        void getAphorisms();
    };

    const resetFilters = () => {
        const isReloadScheduled = filterWord.value !== '' || itemsPerPage.value !== 50 || isSearchByNumber.value;
        filterWord.value = '';
        isSearchByNumber.value = false;
        itemsPerPage.value = 50;
        currentPage.value = 1;
        if (!isReloadScheduled) void getAphorisms();
    };

    watch([itemsPerPage, filterWord, isSearchByNumber], () => {
        if (isApplyingQuery) return;
        currentPage.value = 1;
        void getAphorisms();
    });

    const toggleIsEditableAphorism = (id: string) => {
        const aphorism = aphorisms.value.find(aphorism => aphorism.id === id)!;
        aphorism.isEditable = !aphorism.isEditable;
    };

    const saveAphorism = async ({ author, id, text }: { author: string; id: string; text: string }) => {
        const aphorism = aphorisms.value.find(aphorism => aphorism.id === id)!;
        aphorism.text = text;
        aphorism.author = author;
        aphorism.isEditable = false;

        try {
            await Api.saveAphorism(aphorism);
            await getAphorisms();
            successToast('Сохранение афоризма', 'Афоризм успешно сохранён!');
        } catch (error) {
            const axiosError = error as AxiosError;
            showError(axiosError, 'Сохранение афоризма');
        }
    };

    const addAphorism = async ({ text, author }: { author: string; text: string }) => {
        try {
            await Api.addAphorism({
                text,
                author,
            });
            successToast('Добавление афоризма', 'Афоризм успешно добавлен!');
            return true;
        } catch (error) {
            showError(error, 'Добавление афоризма');
            return false;
        }
    };

    const removeAphorism = async (id: string) => {
        try {
            await Api.removeAphorism(id);
            await getAphorisms();
            successToast('Удаление афоризма', 'Афоризм успешно удалён!');
        } catch (error) {
            const axiosError = error as AxiosError;
            showError(axiosError, 'Удаление афоризма');
            throw new Error(axiosError.message);
        }
    };

    return {
        isLoadedPage,
        isSearchByNumber,
        darkModeName,
        savedDarkModeName,
        accessTokenName,
        refreshTokenName,
        filterWord,
        aphorisms,
        currentPage,
        itemsPerPage,
        total,
        isLoading,
        loadError,
        changePage,
        resetFilters,
        getAphorisms,
        loadFromQuery,
        toggleIsEditableAphorism,
        saveAphorism,
        addAphorism,
        removeAphorism,
    };
});

import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useSpecialToast } from '@/shared/composables/useSpecialToast';
import type { IAphorism } from '@/shared/types';
import type { AxiosError } from 'axios';
import type { LocationQuery } from 'vue-router';
import Api from '@/shared/api/MainApi';

export const useMainStore = defineStore('main', () => {
    const { successToast, showError } = useSpecialToast();
    const isLoadedPage = ref(false);
    const aphorisms = ref<IAphorism[]>([]);
    const isUnBlured = ref(false);
    const filterWord = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(50);
    const total = ref(0);
    const isLoading = ref(false);
    const loadError = ref(false);
    let requestId = 0;
    const darkModeName = ref('isDarkModeAphorisms');
    const savedDarkModeName = ref('isSavedDarkModeAphorisms');
    const accessTokenName = ref('');
    const refreshTokenName = ref('');

    const getAphorisms = async (phraseNumb?: string) => {
        const id = ++requestId;
        isLoading.value = true;
        loadError.value = false;
        aphorisms.value = [];
        try {
            const { data } = await Api.getAphorisms({
                limit: itemsPerPage.value,
                page: currentPage.value,
                search: filterWord.value,
                phraseNumb,
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

    const changePage = (page: number) => {
        currentPage.value = page;
        void getAphorisms();
    };

    watch([itemsPerPage, filterWord], () => {
        currentPage.value = 1;
        void getAphorisms();
    });

    const scrollToChosenAphorism = (query: LocationQuery) => {
        if (Boolean(query.phraseNumb) && !isUnBlured.value) {
            setTimeout(
                () =>
                    document.querySelector('[issingle=true]')
                        ?.scrollIntoView({ behavior: 'smooth' }),
                200,
            );
        }
    };

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
        isUnBlured,
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
        getAphorisms,
        scrollToChosenAphorism,
        toggleIsEditableAphorism,
        saveAphorism,
        addAphorism,
        removeAphorism,
    };
});

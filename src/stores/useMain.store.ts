import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
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
    const darkModeName = ref('isDarkModeAphorisms');
    const savedDarkModeName = ref('isSavedDarkModeAphorisms');
    const accessTokenName = ref('');
    const refreshTokenName = ref('');

    const filteredAphorisms = computed(() => {
        const word = filterWord.value.toLowerCase();
        return aphorisms.value.filter(aphorism =>
            aphorism.text.toLowerCase().includes(word)
            || aphorism.author.toLowerCase().includes(word));
    });

    const getAphorisms = async () => {
        try {
            const { data } = await Api.getAphorisms();
            aphorisms.value = data;
        } catch (error) {
            showError(error, 'Загрузка афоризмов');
        }
    };

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
            const index = aphorisms.value.findIndex(aphorism => aphorism.id === id) ?? -1;
            aphorisms.value.splice(index, 1);
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
        filteredAphorisms,
        getAphorisms,
        scrollToChosenAphorism,
        toggleIsEditableAphorism,
        saveAphorism,
        addAphorism,
        removeAphorism,
    };
});

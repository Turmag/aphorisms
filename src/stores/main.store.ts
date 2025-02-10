import { notify } from '@kyvg/vue3-notification';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { IAphorism } from '@/shared/types';
import type { LocationQuery } from 'vue-router';
import Api from '@/shared/api/CommonApi';

export const mainStore = defineStore('main', () => {
    const isLoadedPage = ref(false);
    const aphorisms = ref<IAphorism[]>([]);
    const isUnBlured = ref(false);
    const filterWord = ref('');
    const darkModeName = ref('isDarkModeAphorisms');
    const savedDarkModeName = ref('isSavedDarkModeAphorisms');

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
            console.error('error', error);
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
        let notifyText = 'Афоризм не удалось сохранить';
        let type = 'error';

        const aphorism = aphorisms.value.find(aphorism => aphorism.id === id)!;
        aphorism.text = text;
        aphorism.author = author;
        aphorism.isEditable = false;
        try {
            const { data: result } = await Api.saveAphorism(aphorism);
            if (result === 'success') {
                notifyText = 'Афоризм успешно сохранён!';
                type = 'success';
            }
        } catch (error) {
            console.error('error', error);
        }

        notify({
            title: 'Сохранение афоризма',
            text: notifyText,
            type,
        });
    };

    const addAphorism = async ({ text, author }: { author: string; text: string }) => {
        let notifyText = 'Афоризм не удалось добавить';
        let type = 'error';
        let isSuccess = false;

        try {
            const { data: result } = await Api.addAphorism({
                text,
                author,
            });
            isSuccess = result === 'success';
            if (isSuccess) {
                notifyText = 'Афоризм успешно добавлен!';
                type = 'success';
            }
        } catch (error) {
            console.error('error', error);
        }

        notify({
            title: 'Добавление афоризма',
            text: notifyText,
            type,
        });

        return isSuccess;
    };

    const removeAphorism = async (id: string) => {
        let notifyText = 'Афоризм не удалось удалить';
        let type = 'error';

        const index = aphorisms.value.findIndex(aphorism => aphorism.id === id) ?? -1;
        aphorisms.value.splice(index, 1);
        try {
            const { data: result } = await Api.removeAphorism(id);
            if (result === 'success') {
                notifyText = 'Афоризм успешно удалён!';
                type = 'success';
            }
        } catch (error) {
            console.error('error', error);
        }

        notify({
            title: 'Удаление афоризма',
            text: notifyText,
            type,
        });
    };

    return {
        isLoadedPage,
        isUnBlured,
        darkModeName,
        savedDarkModeName,
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

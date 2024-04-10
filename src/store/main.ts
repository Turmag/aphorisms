import { defineStore } from 'pinia';
import { Aphorism } from '@/services/types';
import { LocationQuery } from 'vue-router';
import { notify } from '@kyvg/vue3-notification';
import Api from '@/services/api';

export const mainStore = defineStore('main', {
    state: () => {
        return {
            isLoadedPage: false,
            aphorisms: [] as Aphorism[],
            unBlured: false,
            isDarkMode: false,
            isSavedDarkMode: false,
            filterWord: '',
        };
    },

    getters: {
        filteredAphorisms(state): Aphorism[] {
            return state.aphorisms.filter((aphorism: Aphorism) => aphorism.text.toLowerCase().includes(this.filterWord.toLowerCase()) || aphorism.author.toLowerCase().includes(this.filterWord.toLowerCase()));
        },
    },

    actions: {
        async getAphorisms() {
            try {
                const { data } = await Api.getAphorisms();
                this.aphorisms = data;
            } catch (error) {
                console.error('error', error);
            }
        },

        scrollToChosenAphorism(query: LocationQuery) {
            if (Boolean(query.phraseNumb) && !this.unBlured) {
                setTimeout(
                    () =>
                        document.querySelector('[issingle=true]')
                            ?.scrollIntoView({ behavior: 'smooth' }),
                    200,
                );
            }
        },

        toggleIsEditableAphorism(id: string) {
            const aphorism = this.aphorisms.find((aphorism: Aphorism) => aphorism.id === id) ?? {} as Aphorism;
            aphorism.isEditable = !aphorism.isEditable;
        },

        async saveAphorism({ id, text, author }: { id: string; text: string; author: string }) {
            let notifyText = 'Афоризм не удалось сохранить';
            let type = 'error';

            const aphorism = this.aphorisms.find((aphorism: Aphorism) => aphorism.id === id) ?? {} as Aphorism;
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
        },

        async addAphorism({ text, author }: { text: string; author: string }) {
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
        },

        async removeAphorism(id: string) {
            let notifyText = 'Афоризм не удалось удалить';
            let type = 'error';

            const index = this.aphorisms.findIndex((aphorism: Aphorism) => aphorism.id === id) ?? -1;
            this.aphorisms.splice(index, 1);
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
        },
    },
});

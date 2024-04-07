import { defineStore } from 'pinia';
import { Aphorism } from '@/services/types';
import { LocationQuery } from 'vue-router';
import Api from '@/services/api';

export const mainStore = defineStore('main', {
    state: () => {
        return {
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
    },
});

import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
import { type Aphorism } from '@/services/types';
import axios from 'redaxios';
const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export const mainStore = defineStore('main', {
    state: () => {
        return {
            aphorisms: [] as Aphorism[],
            unBlured: false,
            isDarkMode: false,
            isSavedDarkMode: false,
        };
    },
    actions: {
        async getAphorisms() {
            const route = useRoute();
            try {
                const { data }: {data: Aphorism[]} = await axios.get(`${path}/api/getAphorisms.php`);
                this.aphorisms = data;
            } catch (error) {
                console.error('error', error);
            }

            if (Boolean(route.query.phraseNumb) && !this.unBlured) {
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

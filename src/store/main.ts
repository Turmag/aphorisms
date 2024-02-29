import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
import axios from 'redaxios';
const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export const mainStore = defineStore('main', {
    state: () => {
        return {
            aphorisms: [],
            unBlured: false,
        };
    },
    actions: {
        async getAphorisms() {
            const route = useRoute();
            let aphorisms = [];
            try {
                const { data } = await axios.get(`${path}/api/getAphorisms.php`);
                aphorisms = data;
            } catch (error) {
                console.error('error', error);
            }
            this.aphorisms = aphorisms;

            if (Boolean(route.query.phraseNumb) && !this.unBlured) {
                setTimeout(
                    () =>
                        document
                            .querySelector('.blockquote--single')
                            ?.scrollIntoView({ behavior: 'smooth' }),
                    200
                );
            }
        },
    },
});

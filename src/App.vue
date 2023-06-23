<template>
    <h1>Афоризмы</h1>
    <div class="aphorisms">
        <Blockquote
            v-for="(aphorism, i) in store.aphorisms"
            :key="i"
            v-bind="aphorism"
            :numb="i + 1"
        />
    </div>
</template>

<script setup>
    import axios from 'redaxios';
    import { useRoute } from 'vue-router';
    import { mainStore } from './store/main';
    import { onMounted } from 'vue';
    import Blockquote from './components/Blockquote.vue';

    const store = mainStore();
    const route = useRoute();
    onMounted(async () => {
        const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;
        const { data: aphorisms } = await axios.get(`${path}/api/getAphorisms.php`);
        store.$patch({
            aphorisms,
        });

        if (Boolean(route.query.phraseNumb) && !store.unBlured) {
            setTimeout(
                () =>
                    document
                        .querySelector('.blockquote--single')
                        .scrollIntoView({ behavior: 'smooth' }),
                200
            );
        }

        document.onclick = () => {
            store.$patch({
                unBlured: true,
            });
        };
    });
</script>

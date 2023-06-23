import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/aphorisms/',
        name: 'Home',
        component: () => import('../App.vue'),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

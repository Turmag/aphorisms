import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router';
import '@/style.scss';
const pinia = createPinia();
import App from '@/App.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount('#app');

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router';
import '@/style.scss';
import '@/assets/scss/notification.scss';
import 'vue-final-modal/style.css';
const pinia = createPinia();
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import Notifications from '@kyvg/vue3-notification';
import { createVfm } from 'vue-final-modal';
const vfm = createVfm();
import App from '@/App.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.use(Notifications);
app.use(vfm);
app.mount('#app');

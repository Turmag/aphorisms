import '@/style.scss';
import '@/assets/scss/notification.scss';
import 'vue-final-modal/style.css';
import { router } from '@/router/router';
import Notifications from '@kyvg/vue3-notification';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';
import { createApp } from 'vue';
import App from '@/App.vue';

const vfm = createVfm();
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Notifications);
app.use(vfm);
app.mount('#app');

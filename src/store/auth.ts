import { defineStore } from 'pinia';
import { notify } from '@kyvg/vue3-notification';
import Api from '@/shared/api';

export const authStore = defineStore('auth', {
    state: () => {
        return { isAuthorized: false };
    },

    actions: {
        async authorize(password: string) {
            let text = 'Пароль введён неверно';
            let type = 'error';
            let isSuccess = false;

            try {
                const { data } = await Api.authorize(password);
                isSuccess = data === 'success';
                this.isAuthorized = isSuccess;
                if(this.isAuthorized) {
                    text = 'Всё прекрасно!';
                    type = 'success';
                    this.isAuthorized = true;
                }
            } catch (error) {
                console.error('error', error);
            }

            notify({
                title: 'Вход в афоризмы',
                text,
                type,
            });

            return isSuccess;
        },

        async checkAuthorize() {
            try {
                const { data: result } = await Api.checkAuthorize();
                if (result === 'success') this.isAuthorized = true;
            } catch (error) {
                console.error('error', error);
                notify({
                    title: 'Проверка авторизации',
                    text: 'Проверка авторизации не увенчалась успехом',
                    type: 'error',
                });
            }
        },

        async logout() {
            try {
                const { data: result } = await Api.logout();
                if (result === 'success') this.isAuthorized = false;
            } catch (error) {
                console.error('error', error);
                notify({
                    title: 'Выход из афоризмов',
                    text: 'Выход из афоризмов не увенчался успехом',
                    type: 'error',
                });
            }
        },
    },
});

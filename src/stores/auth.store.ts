import { notify } from '@kyvg/vue3-notification';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import Api from '@/shared/api/AuthApi';

export const authStore = defineStore('auth', () => {
    const isAuthorized = ref(false);

    const authorize = async (password: string) => {
        let text = 'Пароль введён неверно';
        let type = 'error';
        let isSuccess = false;

        try {
            const { data } = await Api.authorize(password);
            isSuccess = data === 'success';
            isAuthorized.value = isSuccess;
            if (isAuthorized.value) {
                text = 'Всё прекрасно!';
                type = 'success';
                isAuthorized.value = true;
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
    };

    const checkAuthorize = async () => {
        try {
            const { data: result } = await Api.checkAuthorize();
            if (result === 'success') isAuthorized.value = true;
        } catch (error) {
            console.error('error', error);
            notify({
                title: 'Проверка авторизации',
                text: 'Проверка авторизации не увенчалась успехом',
                type: 'error',
            });
        }
    };

    const logout = async () => {
        try {
            const { data: result } = await Api.logout();
            if (result === 'success') isAuthorized.value = false;
        } catch (error) {
            console.error('error', error);
            notify({
                title: 'Выход из афоризмов',
                text: 'Выход из афоризмов не увенчался успехом',
                type: 'error',
            });
        }
    };

    return {
        isAuthorized,
        authorize,
        checkAuthorize,
        logout,
    };
});

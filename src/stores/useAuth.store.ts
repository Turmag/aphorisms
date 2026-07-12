import { useStorage } from '@vueuse/core';
import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSpecialToast } from '@/shared/composables/useSpecialToast';
import type { IDecodedToken } from '@/shared/types';
import Api from '@/shared/api/AuthApi';

export const useAuthStore = defineStore('auth', () => {
    const { successToast, showError } = useSpecialToast();
    const isAuthorized = ref(false);
    const accessToken = useStorage('aphorismsAccessToken', '');
    const refreshToken = useStorage('aphorismsRefreshToken', '');

    const checkAccessToken = async (isForceGet = false) => {
        if (isAuthorized.value && !isForceGet || !accessToken.value) return;
        if (accessToken.value === 'false') accessToken.value = '';

        try {
            const decodedToken = jwtDecode<IDecodedToken>(accessToken.value);

            const expDate = new Date(decodedToken.exp * 1000);
            const today = new Date();

            if (expDate < today) {
                await getAccessTokenByRefreshTokenLocal();
            } else {
                isAuthorized.value = true;
            }
        } catch (error) {
            showError(error, 'Проверка авторизации');
        }
    };

    const getAccessTokenByRefreshTokenLocal = async (isForceGet = false) => {
        try {
            const { data } = await Api.getAccessTokenByRefreshToken(refreshToken.value);
            accessToken.value = data.access_token;
            refreshToken.value = data.refresh_token;
            await checkAccessToken(isForceGet);
            isAuthorized.value = true;
        } catch (error) {
            showError(error, 'Обновление токена');
            accessToken.value = '';
            refreshToken.value = '';
            return;
        }
    };

    const authorize = async (password: string) => {
        try {
            await Api.authorize(password);
            isAuthorized.value = true;
            successToast('Вход в Афоризмы', 'Всё прекрасно');
        } catch (error) {
            showError(error, 'Вход в Афоризмы');
        }
    };

    return {
        isAuthorized,
        checkAccessToken,
        authorize,
    };
});

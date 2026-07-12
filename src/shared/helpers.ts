import axios from 'axios';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/useAuth.store';
import type { TExtendedError } from '@/shared/types';

export const getSecondsDiff = (d1: Date, d2: Date): number => {
    const diff = (d2.getTime() - d1.getTime()) / 1000;
    return Math.abs(Math.round(diff));
};

export const getErrorMessage = (error: unknown, defaultMessage = 'Произошла ошибка') => {
    const defaultResponse = { data: { title: defaultMessage } };

    const response: TExtendedError['response'] = (error as TExtendedError)?.response ?? defaultResponse;
    response.data = response?.data ?? defaultResponse.data;

    if (typeof response.data !== 'object' || !response.data?.title) {
        response.data = { title: defaultResponse.data.title };
    }

    if (error instanceof Error && response.data.title === defaultMessage) return error.message;

    return response.data.title as string;
};

export const getAxiosInstance = async () => {
    const authStore = useAuthStore();

    await authStore.checkAccessToken();

    return computed(() => {
        const headers: Record<string, unknown> = {};

        if (authStore.accessToken.length) {
            headers.Authorization = `Bearer ${authStore.accessToken}`;
        }

        return axios.create({ headers });
    });
};

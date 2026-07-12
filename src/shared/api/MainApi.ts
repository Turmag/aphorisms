import axios from 'axios';
import type { IAphorism } from '@/shared/types';
import { path } from '@/shared/constants';
import { getAxiosInstance } from '@/shared/helpers';

export default {
    addAphorism: async ({ author, text }: { author: string; text: string }) => {
        const axiosInstance = await getAxiosInstance();
        return axiosInstance.value.post<string>(`${path}api/addAphorism`, {
            author,
            text,
        });
    },
    getAphorisms: () => axios.get<IAphorism[]>(`${path}api/getAphorisms`),
    removeAphorism: async (id: string) => {
        const axiosInstance = await getAxiosInstance();
        return axiosInstance.value.post<string>(`${path}api/removeAphorism`, { id });
    },
    saveAphorism: async (aphorism: IAphorism) => {
        const axiosInstance = await getAxiosInstance();
        return axiosInstance.value.post<string>(`${path}api/saveAphorism`, {
            author: aphorism.author,
            id: aphorism.id,
            text: aphorism.text,
        });
    },
};

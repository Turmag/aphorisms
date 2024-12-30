import axios, { type AxiosPromise } from 'axios';
import type { IAphorism } from '@/shared/types';

const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export default {
    addAphorism: ({ author, text }: { author: string; text: string }): AxiosPromise<string> => {
        const formData = new FormData();
        formData.append('text', text);
        formData.append('author', author);
        return axios.post(`${path}/api/addAphorism.php`, formData, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/html',
            },
        });
    },
    authorize: (password: string): AxiosPromise<string> => {
        const formData = new FormData();
        formData.append('password', password);
        return axios.post(`${path}/api/authorize.php`, formData, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/html',
            },
        });
    },
    checkAuthorize: () => axios.post<string>(`${path}/api/checkAuthorize.php`),
    getAphorisms: () => axios.get<IAphorism[]>(`${path}/api/getAphorisms.php`),
    logout: () => axios.post<string>(`${path}/api/logout.php`),
    removeAphorism: (id: string): AxiosPromise<string> => {
        const formData = new FormData();
        formData.append('id', id);
        return axios.post(`${path}/api/removeAphorism.php`, formData, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/html',
            },
        });
    },
    saveAphorism: (aphorism: IAphorism): AxiosPromise<string> => {
        const formData = new FormData();
        formData.append('id', aphorism.id);
        formData.append('text', aphorism.text);
        formData.append('author', aphorism.author);
        return axios.post(`${path}/api/saveAphorism.php`, formData, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/html',
            },
        });
    },
};

import axios, { AxiosResponse } from 'axios';
const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;
import type { IAphorism } from '@/shared/types';

export default { 
    getAphorisms: (): Promise<{ data: IAphorism[] }> => axios.get(`${path}/api/getAphorisms.php`),
    saveAphorism: (aphorism: IAphorism): Promise<AxiosResponse<string>> => {
        const formData = new FormData();
        formData.append('id', aphorism.id);
        formData.append('text', aphorism.text);
        formData.append('author', aphorism.author);
        return axios.post(`${path}/api/saveAphorism.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    addAphorism: ({ text, author }: { text: string; author: string }): Promise<AxiosResponse<string>> => {
        const formData = new FormData();
        formData.append('text', text);
        formData.append('author', author);
        return axios.post(`${path}/api/addAphorism.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    removeAphorism: (id: string): Promise<AxiosResponse<string>> => {
        const formData = new FormData();
        formData.append('id', id);
        return axios.post(`${path}/api/removeAphorism.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    authorize: (password: string): Promise<AxiosResponse<string>> => {
        const formData = new FormData();
        formData.append('password', password);
        return axios.post(`${path}/api/authorize.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    checkAuthorize: (): Promise<AxiosResponse<string>> => axios.post(`${path}/api/checkAuthorize.php`),
    logout: (): Promise<AxiosResponse<string>> => axios.post(`${path}/api/logout.php`),
};

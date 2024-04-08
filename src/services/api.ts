import axios from 'axios';
const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;
import { Aphorism } from '@/services/types';

export default { 
    getAphorisms: (): Promise<{ data: Aphorism[] }> => axios.get(`${path}/api/getAphorisms.php`),
    saveAphorism: (aphorism: Aphorism): Promise<{ data: string }> => {
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
    addAphorism: ({ text, author }: { text: string; author: string }): Promise<{ data: string }> => {
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
    removeAphorism: (id: string): Promise<{ data: string }> => {
        const formData = new FormData();
        formData.append('id', id);
        return axios.post(`${path}/api/removeAphorism.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    authorize: (password: string): Promise<{ data: string }> => {
        const formData = new FormData();
        formData.append('password', password);
        return axios.post(`${path}/api/authorize.php`, formData, {
            headers: {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*',
            },
        });
    },
    checkAuthorize: (): Promise<{ data: string }> => axios.post(`${path}/api/checkAuthorize.php`),
    logout: (): Promise<{ data: string }> => axios.post(`${path}/api/logout.php`),
};

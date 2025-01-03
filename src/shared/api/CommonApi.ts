import axios, { type AxiosPromise } from 'axios';
import type { IAphorism } from '@/shared/types';

const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export default {
    addAphorism: ({ author, text }: { author: string; text: string }): AxiosPromise<string> => axios.post(`${path}/api/addAphorism.php`, {
        author,
        text,
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
    getAphorisms: () => axios.get<IAphorism[]>(`${path}/api/getAphorisms.php`),
    removeAphorism: (id: string): AxiosPromise<string> => axios.post(`${path}/api/removeAphorism.php`, { id }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
    saveAphorism: (aphorism: IAphorism): AxiosPromise<string> => axios.post(`${path}/api/saveAphorism.php`, {
        author: aphorism.author,
        id: aphorism.id,
        text: aphorism.text,
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
};

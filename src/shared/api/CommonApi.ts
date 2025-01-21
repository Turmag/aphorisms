import axios from 'axios';
import type { IAphorism } from '@/shared/types';

const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export default {
    addAphorism: ({ author, text }: { author: string; text: string }) => axios.post<string>(`${path}/api/addAphorism.php`, {
        author,
        text,
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
    getAphorisms: () => axios.get<IAphorism[]>(`${path}/api/getAphorisms.php`),
    removeAphorism: (id: string) => axios.post<string>(`${path}/api/removeAphorism.php`, { id }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
    saveAphorism: (aphorism: IAphorism) => axios.post<string>(`${path}/api/saveAphorism.php`, {
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

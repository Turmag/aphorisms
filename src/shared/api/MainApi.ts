import axios from 'axios';
import type { IAphorism } from '@/shared/types';
import { path } from '@/shared/constants';

export default {
    addAphorism: ({ author, text }: { author: string; text: string }) => axios.post<string>(`${path}/api/addAphorism.php`, {
        author,
        text,
    }),
    getAphorisms: () => axios.get<IAphorism[]>(`${path}/api/getAphorisms.php`),
    removeAphorism: (id: string) => axios.post<string>(`${path}/api/removeAphorism.php`, { id }),
    saveAphorism: (aphorism: IAphorism) => axios.post<string>(`${path}/api/saveAphorism.php`, {
        author: aphorism.author,
        id: aphorism.id,
        text: aphorism.text,
    }),
};

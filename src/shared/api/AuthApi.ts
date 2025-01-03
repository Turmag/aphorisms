import axios, { type AxiosPromise } from 'axios';

const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;

export default {
    authorize: (password: string): AxiosPromise<string> => axios.post(`${path}/api/authorize.php`, { password }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/html',
        },
    }),
    checkAuthorize: () => axios.post<string>(`${path}/api/checkAuthorize.php`),
    logout: () => axios.post<string>(`${path}/api/logout.php`),
};

import axios from 'axios';
import { path } from '@/shared/constants';

export default {
    authorize: (password: string) => axios.post<string>(`${path}/api/authorize.php`, { password }),
    checkAuthorize: () => axios.post<string>(`${path}/api/checkAuthorize.php`),
    logout: () => axios.post<string>(`${path}/api/logout.php`),
};

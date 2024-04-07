import axios from 'redaxios';
const path = import.meta.env.MODE === 'development' ? '' : import.meta.env.BASE_URL;
import { Aphorism } from '@/services/types';

export default { getAphorisms: (): Promise<{ data: Aphorism[] } > => axios.get(`${path}/api/getAphorisms.php`) };

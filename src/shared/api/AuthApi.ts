import axios from 'axios';
import type { IAccessTokenByRefreshTokenResponse, IAuthorizeResponse } from '@/shared/types';
import { path } from '@/shared/constants';

export default {
    authorize: (password: string) => axios.post<IAuthorizeResponse>(`${path}api/authorize`, { password }),
    getAccessTokenByRefreshToken: async (refreshToken: string) => await axios.post<IAccessTokenByRefreshTokenResponse>(`${path}/api/refresh`, { refreshToken }),
};

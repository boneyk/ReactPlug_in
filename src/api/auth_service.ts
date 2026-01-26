import { AxiosResponse } from 'axios';
import { LoginDTO } from 'dto/DtoAuthService';

import { authInstance } from './config';

export const login_request = (dto: LoginDTO): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  localStorage.removeItem('accessToken');
  return authInstance.post('/auth/login', dto);
};

export const refreshToken = (): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> =>
  authInstance.post('/auth/refresh');

export const logout = (): Promise<AxiosResponse<void>> => authInstance.post('/auth/logout');

import { AxiosResponse } from 'axios';
import { LoginDTO } from 'dto/DtoAuthService';

import { authInstance } from '../api/config';

export const login_request = (dto: LoginDTO): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  localStorage.removeItem('accessToken');
  return authInstance.post('/auth/login', dto);
};

export const refreshToken = (): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  return authInstance.post('/auth/refresh');
};

export const logout = (dto: LoginDTO): Promise<AxiosResponse<void>> => {
  return authInstance.post('/auth/logout', dto);
};

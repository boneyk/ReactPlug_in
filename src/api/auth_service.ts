import { AxiosResponse } from 'axios';
import { LoginDTO } from 'dto/DtoAuthService';

import { instance } from '../api/config';

export const login_request = (dto: LoginDTO): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  localStorage.removeItem('accessToken');
  return instance.post('/auth/login', dto);
};

export const refreshToken = (): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  return instance.post('/auth/refresh');
};

export const logout = (): Promise<AxiosResponse<void>> => {
  return instance.post('/auth/logout');
};

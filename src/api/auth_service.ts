import { AxiosResponse } from 'axios';
import { LoginDTO } from 'dto/DtoAuth';

import { instance } from './config';

export const login_request = (dto: LoginDTO): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> => {
  return instance.post('/auth/login', dto);
};

export const logout = (): Promise<AxiosResponse<void>> => instance.post('/auth/logout');

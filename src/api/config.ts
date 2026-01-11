import axios from 'axios';
import { createTokenRefreshMiddleware } from 'axios-jwt-refresh-token';

import { refreshToken } from './auth_service';

export const getErrorMessage = (status?: number | null): string => {
  if (!status) return 'Произошла неизвестная ошибка';
  if (status >= 500) return 'Ошибка сервера. Попробуйте позже';
  if ([400, 409].includes(status)) return 'Неверные данные запроса';
  return 'Произошла неизвестная ошибка';
};

export const instance = axios.create({
  baseURL: 'http://89.208.106.245:8080',
  withCredentials: true
});

const requestNewTokens = async () => {
  const response = await refreshToken();
  localStorage.setItem('accessToken', response.data.accessToken);
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  };
};

const requestAccessMiddleware = createTokenRefreshMiddleware({
  requestTokens: requestNewTokens,
  onRefreshAndAccessExpire: () => {
    window.location.href = '/login';
  },
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  cookiesOptions: {
    secure: true,
    sameSite: 'strict'
  }
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.request.use((response) => response, requestAccessMiddleware);

export default instance;

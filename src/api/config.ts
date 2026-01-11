import axios, { AxiosInstance } from 'axios';
import { createTokenRefreshMiddleware } from 'axios-jwt-refresh-token';

import { refreshToken } from './auth_service';

export const getErrorMessage = (status?: number | null): string => {
  if (!status) return 'Произошла неизвестная ошибка';
  if (status >= 500) return 'Ошибка сервера. Попробуйте позже';
  if ([400, 409].includes(status)) return 'Неверные данные запроса';
  return 'Произошла неизвестная ошибка';
};

const env = (window as any).__ENV__ || {};

export const authInstance = axios.create({
  baseURL: env.AUTH_BASE_URL ?? 'http://localhost:8080',
  withCredentials: true
});

export const scheduleInstance = axios.create({
  baseURL: env.SCHEDULE_BASE_URL ?? 'http://localhost:8083',
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

const attachInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.request.use((response) => response, requestAccessMiddleware);
};

attachInterceptors(authInstance);
attachInterceptors(scheduleInstance);

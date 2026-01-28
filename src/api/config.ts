import axios, { InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const getErrorMessage = (status?: number | null): string => {
  if (!status) return 'Произошла неизвестная ошибка';
  if (status >= 500) return 'Ошибка сервера. Попробуйте позже';
  if ([400, 409].includes(status)) return 'Неверные данные запроса';
  return 'Произошла неизвестная ошибка';
};
const env = (window as any).__ENV__ || {};

const baseURL = env.BASE_URL ?? 'http://demo.orng.atbplugin.tech';
export const instance = axios.create({ baseURL: baseURL, withCredentials: true, timeout: 60000 });

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && !config.url?.includes('/auth/refresh')) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;
const getFreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
            },
            timeout: 10000
          }
        );
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data.accessToken;
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

const refreshAuthLogic = async (failedRequest: InternalAxiosRequestConfig) => {
  const newAccessToken = await getFreshAccessToken();
  failedRequest.headers = failedRequest.headers ?? {};
  failedRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  return failedRequest;
};

createAuthRefreshInterceptor(instance as any, refreshAuthLogic, { statusCodes: [401] });

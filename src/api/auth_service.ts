import request from './auth';

export const ApiService = {
  auth: async (login: string, password: string) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
  },

  refreshToken: async () => {
    return request('/auth/refresh', {
      method: 'GET'
    });
  },

  logout: async () => {
    return request('/auth/logout', {
      method: 'POST'
    });
  },

  // пример другого эндпоинта
  getUsers: async () => {
    return request('/users', { method: 'GET' });
  },

  createUser: async (user: any) => {
    return request('/users', { method: 'POST', body: JSON.stringify(user) });
  }
};

export default ApiService;

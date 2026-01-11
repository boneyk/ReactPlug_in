type RequestOptions = RequestInit & { _isRetry?: boolean };
const BASE_URL = 'http://localhost:3001';
// TO DO: допилить авторизацию по запросу и разграничение ролей пользователя
const request = async (url: string, options: RequestOptions = {}): Promise<any> => {
  // const token = localStorage.getItem('token');

  // const headers: HeadersInit = {
  //   ...(options.headers || {}),
  //   Authorization: token ? `Bearer ${token}` : '',
  //   'Content-Type': 'application/json'
  // };
  const response = await fetch(BASE_URL + url, {
    ...options
    // credentials: 'include',
    // headers
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401 && !options._isRetry) {
    try {
      // обновляем токен
      const refreshResp = await request('/auth/refresh', { method: 'GET', _isRetry: true });
      localStorage.setItem('token', refreshResp.accessToken);

      // повторяем исходный запрос с новым токеном
      return request(url, { ...options, _isRetry: true });
    } catch (err) {
      console.error('AUTH ERROR', err);
      throw err;
    }
  }
  const errorData = await response.json().catch(() => ({}));
  throw { status: response.status, ...errorData };
};

export default request;

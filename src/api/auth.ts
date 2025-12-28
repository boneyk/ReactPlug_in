type LoginRequestData = {
  login: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};
// faker js
const LoginRequest = async (data: LoginRequestData): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.login === 'developer' && data.password === '12345678') {
        resolve({ access_token: 'fake_token_tadaaaa', refresh_token: ';skf;akl;' });
      } else {
        reject(new Error('Неверный логин или пароль'));
      }
    });
  });
};

export default LoginRequest;

import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import jwtDecode from 'jwt-decode';

import { login_request } from '@/api/auth_service';
import { getErrorMessage } from '@/api/config';
import { LoginDTO } from '@/dto/DtoAuth';

export type JwtPayload = {
  authorities: string[];
  user_id: string;
};

export const useLoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const loginError = login.length > 0 && login.length < 4;
  const loginHelperText = loginError ? 'Минимум 4 символa' : '';
  const passwordError = password.length > 0 && password.length < 8;
  const passwordHelperText = passwordError ? 'Минимум 8 символов' : ' ';

  const isFormValid = () => {
    return login.length >= 4 && login.length <= 128 && password.length >= 8 && password.length <= 255;
  };
  const isDisabled = !isFormValid();

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (isDisabled) return;

    const loginDTO: LoginDTO = {
      username: login,
      password
    };

    login_request(loginDTO)
      .then((response: any) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        const decoded: JwtPayload = jwtDecode(response.data.accessToken);

        localStorage.setItem('authorities', decoded.authorities.join(','));
        localStorage.setItem('user_id', decoded.user_id);
        navigate('/schedule', { replace: true });
      })
      .catch((err: any) => {
        const status = err.response?.status;
        if (status === 404) return setError('Неверный логин или пароль');
        setError(getErrorMessage(status));
      });
  };
  const sendSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return {
    login,
    password,
    showPassword,
    error,
    isDisabled,
    toggleShowPassword,
    handleSubmit,
    handleLoginChange,
    handlePasswordChange,
    loginError,
    loginHelperText,
    passwordError,
    passwordHelperText,
    sendSubmit
  };
};

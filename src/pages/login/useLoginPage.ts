import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginDTO } from 'dto/DtoAuthService';
import jwtDecode from 'jwt-decode';

import { login_request } from '../../api/auth_service';
import { getErrorMessage } from '../../api/config';

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
  const loginError = login.length > 0 && login.length < 5;
  const loginHelperText = loginError ? 'Минимум 5 символов' : '';
  const passwordError = password.length > 0 && password.length < 8;
  const passwordHelperText = passwordError ? 'Минимум 8 символов' : ' ';

  const isFormValid = () => {
    return login.length >= 5 && login.length <= 255 && password.length >= 8 && password.length <= 255;
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
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        const decoded: JwtPayload = jwtDecode(response.data.accessToken);
        console.log(decoded.authorities.join(','));
        console.log(decoded.user_id);

        localStorage.setItem('authorities', decoded.authorities.join(','));
        localStorage.setItem('user_id', decoded.user_id);

        navigate('/timetable', { replace: true });
      })
      .catch((err) => {
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

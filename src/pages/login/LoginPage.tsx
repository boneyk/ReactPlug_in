import { useState } from 'react';

import Groups2Icon from '@mui/icons-material/Groups2';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Stack, TextField } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';

import LoginRequest from '../../api/auth';

import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const handleClickShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const isFormValid = () => login.trim() !== '' && password.length >= 8;

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    console.log('Login:', login, 'Password:', password);
    setLoading(true);
    setError(null);
    const response = await LoginRequest({ login, password });
    console.log('TOKEN:', response.access_token);
    // try {
    //   const response = await loginRequest({ login, password });
    //   console.log('TOKEN:', response.token);
    //   TO DO:
    //   // - сохранить токен
    //   // - редирект
    // } catch (err) {
    //   setError((err as Error).message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Groups2Icon sx={{ fontSize: 180, color: 'text.secondary' }} />
        <TextField
          sx={{ m: 1, width: '40ch' }}
          id="filled-hidden-label-normal"
          label="Логин"
          variant="filled"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          error={login.trim() === ' '}
        />
        <FormControl sx={{ m: 1, width: '40ch' }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">{`Пароль`}</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            error={password.length > 0 && password.length < 8}
          />
        </FormControl>
        <Button className={styles.button} variant="contained" onClick={handleSubmit} disabled={!isFormValid()}>
          {`Войти`}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginPage;

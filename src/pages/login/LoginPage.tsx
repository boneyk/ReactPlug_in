import Groups2Icon from '@mui/icons-material/Groups2';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, Box, Button, FormHelperText, Stack, TextField } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { observer } from 'mobx-react-lite';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLoginPage } from '@/hooks/useLoginPage';

import styles from './LoginPage.module.scss';

const LoginPage = observer(() => {
  useDocumentTitle();
  const {
    login,
    password,
    showPassword,
    error,
    isDisabled,
    toggleShowPassword,
    handleLoginChange,
    handlePasswordChange,
    loginError,
    loginHelperText,
    passwordError,
    passwordHelperText,
    sendSubmit
  } = useLoginPage();
  return (
    <Box className={styles.container} component="form" onSubmit={sendSubmit}>
      <Stack spacing={2} className={styles.container}>
        <Groups2Icon className={styles.icon} />
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <TextField
          className={styles.input}
          label="Логин"
          variant="filled"
          value={login}
          onChange={handleLoginChange}
          error={loginError}
          helperText={loginHelperText}
        />
        <FormControl className={styles.input} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Пароль</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            error={passwordError}
          />
          <FormHelperText>{passwordHelperText}</FormHelperText>
        </FormControl>
        <Button className={styles.button} variant="contained" type="submit" disabled={isDisabled}>
          Войти
        </Button>
      </Stack>
    </Box>
  );
});

export default LoginPage;

import LoginIcon from '@mui/icons-material/Login';
import { Box, Stack, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={2} alignItems="center" textAlign="center">
        <LoginIcon sx={{ fontSize: 64, color: 'text.secondary' }} />

        <Typography variant="h6" color="text.secondary">
          login page
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginPage;

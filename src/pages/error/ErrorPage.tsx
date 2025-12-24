import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '@mui/material';

const ErrorPage = () => {
  const { err } = useParams();
  const navigate = useNavigate();
  const errorCode = err ?? '404';
  const handleClick = () => {
    navigate('/');
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography variant="h1" color="text.primary">
          {errorCode}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="body1"
            color="text.secondary"
          >{`Sorry, the page you visited does not exist.`}</Typography>
        </Stack>

        <Button variant="contained" color="primary" onClick={handleClick}>{`Back Home`}</Button>
      </Stack>
    </Box>
  );
};

export default ErrorPage;

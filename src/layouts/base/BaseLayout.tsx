import { Outlet, useNavigate } from 'react-router-dom';

import ArticleIcon from '@mui/icons-material/Article';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import { Box, Button, Stack, Typography } from '@mui/material';

const BaseLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'schedule', label: 'Расписание', icon: <CalendarMonthIcon /> },
    { key: 'users', label: 'Пользователи', icon: <GroupIcon /> },
    { key: 'applications', label: 'Заявки', icon: <ArticleIcon /> }
  ];

  const handleClick = (key: string) => {
    navigate(`/${key}`);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box sx={{ bgcolor: 'primary.contrastText', p: 1, borderBottom: '2px solid black' }}>
        <Stack direction="row" spacing={2}>
          <img src="/favicon.svg" style={{ width: '44px' }}></img>
          {menuItems.map((item) => (
            <Button key={item.key} startIcon={item.icon} color="secondary" onClick={() => handleClick(item.key)}>
              {item.label}
            </Button>
          ))}
        </Stack>
      </Box>

      <Box flexGrow={1} sx={{ p: 2, overflow: 'auto' }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ textAlign: 'center', py: 2, bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          {`Copyright © ${new Date().getFullYear()} Material UI SAS, trading as MUI`}
        </Typography>
        {/*TO DO: убрать подпись в футере*/}
      </Box>
    </Box>
  );
};

export default BaseLayout;

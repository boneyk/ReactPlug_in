import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import ArticleIcon from '@mui/icons-material/Article';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import { Box, Button, Stack, Typography } from '@mui/material';

const BaseLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: 'schedule', label: 'Расписание', icon: <CalendarMonthIcon /> },
    { key: 'users', label: 'Пользователи', icon: <GroupIcon /> },
    { key: 'applications', label: 'Заявки', icon: <ArticleIcon /> }
  ];

  const path = location.pathname.split('/')[1] || 'users';
  const [activeKey, setActiveKey] = useState(path);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/users', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleClick = (key: string) => {
    setActiveKey(key);
    navigate(`/${key}`);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box sx={{ bgcolor: 'primary.contrastText', p: 1, borderBottom: '2px solid black' }}>
        <Stack direction="row" spacing={2}>
          <img src="/favicon.svg" style={{ width: '44px' }}></img>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              startIcon={item.icon}
              variant={activeKey === item.key ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => handleClick(item.key)}
            >
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
      </Box>
    </Box>
  );
};

export default BaseLayout;

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import { Box, Button, Stack, Typography } from '@mui/material';
import { logout } from 'api/auth_service';
import logo from 'assets/logo.svg';
import classNames from 'classnames';
import { timetableStore } from 'stores/timetable.store';

import BurgerMenu from '@/components/BurgerMenu';
import WarningMessage from '@/components/WarningMessage';

import { isUserAdmin } from '@/utils/auth';

import styles from './BaseLayout.module.scss';

const BaseLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (key: string) => {
    navigate(`/${key}`);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authorities');
    localStorage.removeItem('selectedOfficeId');
    timetableStore.resetStore();
    navigate('/login');
  };

  const menuItems = [
    { key: 'schedule', label: 'Расписание', icon: <CalendarMonthIcon /> },
    { key: 'employee', label: 'Сотрудники', icon: <GroupIcon /> },
    isUserAdmin()
      ? { key: 'schedule/my', label: 'Мой график смен', icon: <AssignmentIndIcon /> }
      : { key: 'stats', label: 'График выработки', icon: <WorkIcon /> }
  ];

  const burgerMenuItems = menuItems.reduce(
    (acc, item) => {
      acc[item.label] = () => handleClick(item.key);
      return acc;
    },
    {} as Record<string, () => void>
  );
  burgerMenuItems['Выход'] = handleLogout;

  return (
    <Box className={styles.layout}>
      <WarningMessage />
      <Box className={styles.header}>
        <Stack direction="row" spacing={2} className={styles.headerContent}>
          <img src={logo} className={styles.logo} alt="logo" />
          <div className={styles.desktopNav}>
            {menuItems.map((item) => (
              <Button
                key={item.key}
                startIcon={item.icon}
                color="secondary"
                className={classNames(styles.navBtn, { [styles.selected]: location.pathname === `/${item.key}` })}
                onClick={() => handleClick(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <Button onClick={handleLogout} endIcon={<LogoutIcon />} className={styles.logout}>
            Выход
          </Button>
          <div className={styles.mobileNav}>
            <BurgerMenu items={burgerMenuItems} />
          </div>
        </Stack>
      </Box>

      <Box className={styles.content}>
        <Outlet />
      </Box>

      <Box component="footer" className={styles.footer}>
        <Typography variant="body2" color="text.secondary">
          {`Copyright © ${new Date().getFullYear()} Material UI SAS, trading as MUI`}
        </Typography>
      </Box>
    </Box>
  );
};

export default BaseLayout;

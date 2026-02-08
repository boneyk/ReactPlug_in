import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, Stack, Typography } from '@mui/material';
import logo from 'assets/logo.svg';
import axios from 'axios';
import classNames from 'classnames';

import BurgerMenu from '@/components/BurgerMenu';
import WarningMessage from '@/components/WarningMessage';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { isUserAdmin } from '@/utils/auth';

import styles from './BaseLayout.module.scss';
import { logout } from '@/api/auth_service';
import { queryClient } from '@/api/queries';
import { baseLayoutStore } from '@/stores/baseLayout.store';
import { employeesStore } from '@/stores/employees.store';
import { timetableStore } from '@/stores/timetable.store';

const BaseLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle();

  const handleClick = (key: string) => {
    navigate(`/${key}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('selectedOfficeId');
      localStorage.removeItem('authorities');
      timetableStore.resetStore();
      employeesStore.resetStore();
      navigate('/login');
    } catch (error) {
      let message = 'Не удалось выйти из системы. Попробуйте снова.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
    }
  };

  const menuItems = [
    { key: 'schedule', label: 'Расписание', icon: <CalendarMonthIcon /> },
    !isUserAdmin()
      ? { key: 'schedule/my', label: 'Мой график смен', icon: <AssignmentIndIcon /> }
      : { key: 'employee', label: 'Сотрудники', icon: <GroupIcon /> }
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
          {`Copyright © ${new Date().getFullYear()} KiberOrange team`}
        </Typography>
      </Box>
    </Box>
  );
};

export default BaseLayout;

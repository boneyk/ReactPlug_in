import { Navigate, useRoutes } from 'react-router-dom';

import BaseLayout from 'layouts/base/BaseLayout';
import Placeholder from 'navigation/Placeholder';
import ErrorPage from 'pages/error/ErrorPage';
import LoginPage from 'pages/login/LoginPage';

import EmployeesTable from '@/components/EmployeesTable';
import CalendarWidget from '@/components/TimetableComponent/CalendarWidget';

import { ProtectedRouteProvider } from './ProtectedRouteProvider';
import { SuspenseLayout } from './SuspenseLayout';
import TimetablePage from '@/pages/timetable/TimetablePage';

const Navigation = () => {
  const routes = [
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      element: <ProtectedRouteProvider />,
      children: [
        {
          element: <BaseLayout />,
          children: [
            {
              index: true,
              path: '/',
              element: <Navigate to="/login" replace />
            },
            {
              element: <SuspenseLayout />,
              children: [
                {
                  path: 'schedule',
                  element: <TimetablePage />
                },
                {
                  path: 'schedule/my',
                  element: <CalendarWidget title={'Мой график смен'} />
                },
                {
                  path: 'stats',
                  element: <CalendarWidget title={'Статистика'} showDropdown={true} />
                },
                {
                  path: 'employee',
                  element: <EmployeesTable />
                },
                {
                  path: 'users',
                  children: [
                    { index: true, element: <Placeholder text="i am users list" /> },
                    { path: 'create', element: <Placeholder text="i am create user page" /> },
                    { path: 'edit/:id', element: <Placeholder text="i am edit user page" /> }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: 'error/:err',
      element: <ErrorPage />
    },
    {
      path: '*',
      element: <Navigate to="/error/404" replace />
    }
  ];

  return useRoutes(routes);
};

export default Navigation;

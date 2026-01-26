import { Navigate, useRoutes } from 'react-router-dom';

import BaseLayout from 'layouts/base/BaseLayout';
import Placeholder from 'navigation/Placeholder';
import ErrorPage from 'pages/error/ErrorPage';
import LoginPage from 'pages/login/LoginPage';

import EmployeesTable from '../components/EmployeesTable';

import TimetablePage from '../pages/timetable/TimetablePage';

import { ProtectedRouteProvider } from './ProtectedRouteProvider';
import { SuspenseLayout } from './SuspenseLayout';

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
                  path: 'employees',
                  children: [
                    { index: true, element: <EmployeesTable /> },
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

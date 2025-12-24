import { Navigate, useRoutes } from 'react-router-dom';

import BaseLayout from 'layouts/base/BaseLayout';
import Placeholder from 'navigation/Placeholder';
import ErrorPage from 'pages/error/ErrorPage';
import LoginPage from 'pages/login/LoginPage';

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
              path: '/'
              // element: defaultPath ? <Navigate replace to={defaultPath} /> : <SpinCentered spinning />
            },
            {
              element: <SuspenseLayout />,
              children: [
                {
                  path: 'schedule',
                  element: <Placeholder text={'i am schedule page'} />
                },
                {
                  path: 'applications',
                  element: <Placeholder text={'i am applications page'} />
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

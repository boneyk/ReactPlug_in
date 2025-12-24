import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { errorPath } from 'utils';

export const ProtectedRouteProvider = () => {
  const hasAccess = true;

  if (!hasAccess) {
    return <Navigate to={errorPath(403)} replace />;
  }

  return <Outlet />;
};

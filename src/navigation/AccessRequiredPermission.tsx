import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { errorPath } from 'utils';

interface AccessRequiredProps {
  children: JSX.Element;
  roles?: string[];
}

export const AccessRequiredPermission = ({ children }: AccessRequiredProps): JSX.Element => {
  const hasAccess = true;

  if (!hasAccess) {
    return <Navigate to={errorPath(403)} replace />;
  }

  return children;
};

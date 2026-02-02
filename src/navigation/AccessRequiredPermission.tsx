import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { isUserAdmin } from '@/utils/auth';
import { errorPath } from 'utils';

interface AccessRequiredProps {
  children: JSX.Element;
  roles?: string[];
}

export const AccessRequiredPermission = ({ children }: AccessRequiredProps): JSX.Element => {
  if (!isUserAdmin()) {
    return <Navigate to={errorPath(403)} replace />;
  }
  return children;
};

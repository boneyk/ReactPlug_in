import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AccessRequiredPermission } from 'navigation/AccessRequiredPermission';

import SpinCentered from 'components/spin-centered/SpinCentered';

export const SuspenseLayout = () => (
  <AccessRequiredPermission>
    <Suspense fallback={<SpinCentered />}>
      <Outlet />
    </Suspense>
  </AccessRequiredPermission>
);

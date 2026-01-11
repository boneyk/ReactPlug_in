import { FC, ReactNode } from 'react';

import { Box, CircularProgress } from '@mui/material';

import styles from './SpinCentered.module.scss';

interface SpinCenteredProps {
  loading?: boolean;
  size?: number;
  className?: string;
  children?: ReactNode;
}

const SpinCentered: FC<SpinCenteredProps> = ({ loading = true, size = 40, className, children }) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Box className={`${styles.spin} ${className ?? ''}`}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default SpinCentered;

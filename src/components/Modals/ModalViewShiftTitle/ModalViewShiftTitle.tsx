import { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import { ShiftModalData } from '../../../hooks/useViewModal';

interface ModalViewShiftInfoProps {
  shiftData: ShiftModalData;
}

export const ModalViewShiftTitle: FC<ModalViewShiftInfoProps> = ({ shiftData }) => {
  return (
    <Stack direction="column">
      <Typography variant="h6">{shiftData.job}</Typography>
      <Typography variant="subtitle1">{shiftData.text}</Typography>
    </Stack>
  );
};

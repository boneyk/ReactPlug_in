import { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import { ShiftModalData } from '../ModalView/ModalView';

interface ShiftInfoProps {
  shiftData: ShiftModalData;
}

export const ShiftTitle: FC<ShiftInfoProps> = ({ shiftData }) => {
  return (
    <Stack direction="column">
      <Typography variant="h6">{shiftData.job}</Typography>
      <Typography variant="subtitle1">{shiftData.text}</Typography>
    </Stack>
  );
};

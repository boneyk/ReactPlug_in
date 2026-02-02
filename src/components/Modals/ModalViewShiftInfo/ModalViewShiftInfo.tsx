import { FC } from 'react';

import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import { Stack, Typography } from '@mui/material';

import { ShiftModalData } from '@/hooks/useViewModal';

import styles from './ModalViewShiftInfo.module.scss';

interface ModalViewShiftInfoProps {
  shiftData: ShiftModalData;
}

export const ModalViewShiftInfo: FC<ModalViewShiftInfoProps> = ({ shiftData }) => {
  const formattedDates =
    shiftData.startDate === shiftData.endDate ? shiftData.startDate : `${shiftData.startDate} - ${shiftData.endDate}`;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={1} className={styles.infoRow}>
        <DateRangeIcon />
        <Typography>{formattedDates}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} className={styles.infoRow}>
        <PersonIcon />
        <Typography>{shiftData.fullname}</Typography>
      </Stack>
    </Stack>
  );
};

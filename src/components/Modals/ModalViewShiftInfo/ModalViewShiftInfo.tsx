import { FC } from 'react';

import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { ShiftModalData } from '../ModalView/ModalView';

interface ShiftInfoProps {
  shiftData: ShiftModalData;
}

export const ShiftInfo: FC<ShiftInfoProps> = ({ shiftData }) => {
  const start = dayjs().date(shiftData.dayIndex + 1);
  const end = start.add(shiftData.spanDays - 1, 'day');

  const formattedDates =
    shiftData.spanDays === 1
      ? start.format('DD.MM.YYYY')
      : `${start.format('DD.MM.YYYY')} - ${end.format('DD.MM.YYYY')}`;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={1}>
        <DateRangeIcon />
        <Typography>{formattedDates}</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <PersonIcon />
        <Typography>{shiftData.fullname}</Typography>
      </Stack>
    </Stack>
  );
};

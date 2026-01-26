import { FC, useEffect } from 'react';

import { Stack } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';

import { useModalCreateDatePeriod } from './useModalCreateDatePeriod';

type ModalCreateDatePeriodProps = {
  defaultStartDate: Dayjs | null;
};
export const ModalCreateDatePeriod: FC<ModalCreateDatePeriodProps> = observer(({ defaultStartDate }) => {
  const startPickerProps = useModalCreateDatePeriod(timetableCreateStore.startDate, timetableCreateStore.errors.start);
  const endPickerProps = useModalCreateDatePeriod(timetableCreateStore.endDate, timetableCreateStore.errors.end);
  useEffect(() => {
    if (defaultStartDate) {
      timetableCreateStore.setStartDate(defaultStartDate);
      timetableCreateStore.setEndDate(defaultStartDate);
    }
  }, [defaultStartDate]);
  return (
    <Stack direction="row" spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateTimePicker
          label="Начало смены"
          value={timetableCreateStore.startDate}
          onChange={timetableCreateStore.setStartDate}
          {...startPickerProps}
        />
        <DateTimePicker
          label="Конец смены"
          value={timetableCreateStore.endDate}
          onChange={timetableCreateStore.setEndDate}
          {...endPickerProps}
        />
      </LocalizationProvider>
    </Stack>
  );
});

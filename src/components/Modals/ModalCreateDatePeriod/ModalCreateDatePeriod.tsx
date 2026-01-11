import { Stack } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';

export const DatePeriod = observer(() => {
  return (
    <Stack direction="row" spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateTimePicker
          label="Начало смены"
          value={timetableCreateStore.startDate}
          onChange={timetableCreateStore.setStartDate}
          shouldDisableDate={(date) => date.day() === 0}
          maxTime={timetableCreateStore.maxHour}
          minTime={timetableCreateStore.minHour}
          slotProps={{
            textField: {
              error: !!timetableCreateStore.errors.start,
              helperText: timetableCreateStore.errors.start
            }
          }}
        />
        <DateTimePicker
          label="Конец смены"
          value={timetableCreateStore.endDate}
          onChange={timetableCreateStore.setEndDate}
          shouldDisableDate={(date) => date.day() === 0}
          maxTime={timetableCreateStore.maxHour}
          minTime={timetableCreateStore.minHour}
          slotProps={{
            textField: {
              error: !!timetableCreateStore.errors.start,
              helperText: timetableCreateStore.errors.start
            }
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
});

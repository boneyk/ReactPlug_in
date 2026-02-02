import { FC, useEffect } from 'react';

import { Box, Grid2, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';
import { modalCreateStore } from 'stores/modalCreate.store';

import { useModalCreateDatePeriod } from '@/hooks/useModalCreateDatePeriod';
import { updateTime } from '@/utils/dateTime';

import styles from './ModalCreateDatePeriod.module.scss';

dayjs.locale('ru');

type ModalCreateDatePeriodProps = {
  isEdit?: boolean;
  defaultStartDate?: Dayjs | null;
};

export const ModalCreateDatePeriod: FC<ModalCreateDatePeriodProps> = observer(
  ({ isEdit = false, defaultStartDate = null }) => {
    useEffect(() => {
      if (defaultStartDate) {
        modalCreateStore.setStartDate(defaultStartDate);
        modalCreateStore.setEndDate(defaultStartDate);
      }
    }, [defaultStartDate]);

    const startPickerProps = useModalCreateDatePeriod({
      date: modalCreateStore.startDate,
      error: modalCreateStore.errors.start,
      isEdit
    });

    const endPickerProps = useModalCreateDatePeriod({
      date: modalCreateStore.endDate,
      error: modalCreateStore.errors.end,
      isEdit
    });

    const handleStartTimeChange = (newTime: Dayjs | null) => {
      const updated = updateTime(modalCreateStore.startDate, newTime);
      if (updated) modalCreateStore.setStartDate(updated);
    };

    const handleEndTimeChange = (newTime: Dayjs | null) => {
      const updated = updateTime(modalCreateStore.endDate, newTime);
      if (updated) modalCreateStore.setEndDate(updated);
    };

    const renderEdit = () => (
      <Grid2 container direction="column" spacing={2} className={styles.contentWrapper}>
        <Box className={styles.info}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Дата смены
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {modalCreateStore.startDate?.locale('ru').format('dd, DD MMMM YYYY') || '—'}
          </Typography>
        </Box>
        <Grid2 container direction="row" className={styles.wrapper}>
          <TimePicker
            label="Время начала"
            value={modalCreateStore.startDate}
            onChange={handleStartTimeChange}
            {...startPickerProps}
            className={styles.timePicker}
          />
          <TimePicker
            label="Время конца"
            value={modalCreateStore.endDate}
            onChange={handleEndTimeChange}
            {...endPickerProps}
            className={styles.timePicker}
          />
        </Grid2>
      </Grid2>
    );

    const renderCreate = () => (
      <Grid2 container direction="row" className={styles.wrapperTime}>
        <DateTimePicker
          label="Начало смены"
          value={modalCreateStore.startDate}
          onChange={modalCreateStore.setStartDate}
          {...startPickerProps}
          className={styles.datePicker}
        />
        <DateTimePicker
          label="Конец смены"
          value={modalCreateStore.endDate}
          onChange={modalCreateStore.setEndDate}
          {...endPickerProps}
          className={styles.datePicker}
        />
      </Grid2>
    );

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <Grid2 spacing={2} className={styles.datePeriod}>
          {isEdit ? renderEdit() : renderCreate()}
        </Grid2>
      </LocalizationProvider>
    );
  }
);

import { ChangeEvent, FC, useEffect } from 'react';

import { Box, FormControlLabel, Grid2, MenuItem, Switch, TextField } from '@mui/material';
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';
import { modalCreateStore } from 'stores/modalCreate.store';

import { useModalCreateDatePeriod } from '@/hooks/useModalCreateDatePeriod';
import { updateDate, updateTime } from '@/utils/dateTime';
import { Formats } from '@/utils/formats';

import styles from './ModalCreateDatePeriod.module.scss';

dayjs.locale('ru');

type ModalCreateDatePeriodProps = {
  isEdit?: boolean;
  defaultStartDate?: Dayjs | null;
};

export const ModalCreateDatePeriod: FC<ModalCreateDatePeriodProps> = observer(
  ({ isEdit = false, defaultStartDate = null }) => {
    const editMode = modalCreateStore.editMode;

    useEffect(() => {
      if (defaultStartDate) {
        modalCreateStore.setStartDate(defaultStartDate);
        modalCreateStore.setEndDate(defaultStartDate);
      }
    }, [defaultStartDate]);

    const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
      modalCreateStore.setEditMode(event.target.checked ? 'period' : 'single');
    };

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

    const handleDateSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const selectedDate = modalCreateStore.shiftDates.find((d) => d.format('YYYY-MM-DD') === event.target.value);
      if (selectedDate) {
        modalCreateStore.selectShiftDate(selectedDate);
      }
    };

    const handlePeriodStartChange = (newDate: Dayjs | null) => {
      const updated = updateDate(modalCreateStore.startDate, newDate);
      if (updated) {
        modalCreateStore.setStartDate(updated);
        if (modalCreateStore.endDate && updated.isAfter(modalCreateStore.endDate, 'day')) {
          modalCreateStore.setEndDate(updated);
        }
      }
    };

    const handlePeriodEndChange = (newDate: Dayjs | null) => {
      const updated = updateDate(modalCreateStore.endDate, newDate);
      if (updated) {
        modalCreateStore.setEndDate(updated);
        if (modalCreateStore.startDate && updated.isBefore(modalCreateStore.startDate, 'day')) {
          modalCreateStore.setStartDate(updated);
        }
      }
    };

    const handleCreateStartChange = (newDate: Dayjs | null) => {
      if (newDate) {
        modalCreateStore.setStartDate(newDate);
        if (modalCreateStore.endDate && newDate.isAfter(modalCreateStore.endDate)) {
          modalCreateStore.setEndDate(newDate);
        }
      }
    };

    const handleCreateEndChange = (newDate: Dayjs | null) => {
      if (newDate) {
        modalCreateStore.setEndDate(newDate);
        if (modalCreateStore.startDate && newDate.isBefore(modalCreateStore.startDate)) {
          modalCreateStore.setStartDate(newDate);
        }
      }
    };

    const renderEdit = () => {
      const startTimePickerProps = { ...startPickerProps };
      const endTimePickerProps = { ...endPickerProps };
      delete startTimePickerProps.shouldDisableDate;
      delete endTimePickerProps.shouldDisableDate;

      const minDate = modalCreateStore.shiftDates[0] || null;
      const maxDate = modalCreateStore.shiftDates[modalCreateStore.shiftDates.length - 1] || null;

      return (
        <Grid2 container direction="column" spacing={2} className={styles.contentWrapper}>
          {editMode === 'single' ? (
            <Box className={styles.info}>
              <TextField
                select
                fullWidth
                label="Дата редактируемой смены"
                value={modalCreateStore.startDate?.format(Formats.DATE) || ''}
                onChange={handleDateSelect}
                className={styles.shiftPicker}
              >
                {modalCreateStore.shiftDates.map((date) => (
                  <MenuItem key={date.format(Formats.DATE)} value={date.format(Formats.DATE)}>
                    {date.locale('ru').format(Formats.DATE_CLIENT)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ) : (
            <Grid2 container direction="row" className={styles.periodDatePickers}>
              <DatePicker
                label="Дата начала периода"
                value={modalCreateStore.startDate}
                onChange={handlePeriodStartChange}
                minDate={minDate}
                maxDate={maxDate}
              />
              <DatePicker
                label="Дата конца периода"
                value={modalCreateStore.endDate}
                onChange={handlePeriodEndChange}
                minDate={minDate}
                maxDate={maxDate}
              />
            </Grid2>
          )}
          <Grid2 container direction="row" className={styles.wrapper}>
            <TimePicker
              label="Время начала"
              value={modalCreateStore.startDate}
              onChange={handleStartTimeChange}
              {...startTimePickerProps}
              className={styles.timePicker}
            />
            <TimePicker
              label="Время конца"
              value={modalCreateStore.endDate}
              onChange={handleEndTimeChange}
              {...endTimePickerProps}
              className={styles.timePicker}
            />
          </Grid2>
        </Grid2>
      );
    };

    const renderCreate = () => (
      <Grid2 container direction="row" className={styles.wrapperTime}>
        <DateTimePicker
          label="Начало смены"
          value={modalCreateStore.startDate}
          onChange={handleCreateStartChange}
          {...startPickerProps}
          className={styles.datePicker}
        />
        <DateTimePicker
          label="Конец смены"
          value={modalCreateStore.endDate}
          onChange={handleCreateEndChange}
          {...endPickerProps}
          className={styles.datePicker}
        />
      </Grid2>
    );

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        {isEdit && (
          <FormControlLabel
            control={<Switch checked={editMode === 'period'} onChange={handleModeChange} size="small" />}
            label={editMode === 'period' ? 'Редактировать период смен' : 'Редактировать одну смену'}
            className={styles.editModeControl}
          />
        )}
        <Grid2 spacing={2} className={styles.datePeriod}>
          {isEdit ? renderEdit() : renderCreate()}
        </Grid2>
      </LocalizationProvider>
    );
  }
);

import { ChangeEvent } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid2,
  MenuItem,
  Switch,
  TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';

import styles from '../ModalCreate/ModalCreate.module.scss';

import { modalDeleteStore } from '@/stores/modalDelete.store';
import { modalSelectDatesToDeleteStore } from '@/stores/modalSelectDatesToDelete.store';
import { modalViewStore } from '@/stores/modalView.store';

dayjs.locale('ru');

const ModalSelectDatesToDelete = observer(() => {
  const { isOpen, deleteMode, startDate, endDate, shiftDates, shiftData } = modalSelectDatesToDeleteStore;

  const handleClose = () => {
    if (shiftData) {
      modalViewStore.open(shiftData);
    }
    modalSelectDatesToDeleteStore.close();
  };

  const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    modalSelectDatesToDeleteStore.setDeleteMode(event.target.checked ? 'period' : 'single');
  };

  const handleDateSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = shiftDates.find((d) => d.format('YYYY-MM-DD') === event.target.value);
    if (selectedDate) {
      modalSelectDatesToDeleteStore.setStartDate(selectedDate);
      modalSelectDatesToDeleteStore.setEndDate(selectedDate);
    }
  };

  const handlePeriodStartChange = (newDate: Dayjs | null) => {
    modalSelectDatesToDeleteStore.setStartDate(newDate);
    if (newDate && endDate && newDate.isAfter(endDate)) {
      modalSelectDatesToDeleteStore.setEndDate(newDate);
    }
  };

  const handlePeriodEndChange = (newDate: Dayjs | null) => {
    modalSelectDatesToDeleteStore.setEndDate(newDate);
    if (newDate && startDate && newDate.isBefore(startDate)) {
      modalSelectDatesToDeleteStore.setStartDate(newDate);
    }
  };

  const handleConfirm = () => {
    if (!shiftData) return;

    modalSelectDatesToDeleteStore.close();

    modalDeleteStore.open(shiftData.id, shiftData, startDate, endDate, deleteMode);
  };

  const minDate = shiftDates[0] || null;
  const maxDate = shiftDates[shiftDates.length - 1] || null;

  const isValidDates = deleteMode === 'single' || (startDate && endDate && !startDate.isAfter(endDate));
  const canConfirm = startDate && endDate && isValidDates;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.deleteTitle}>Выбор дат для удаления</DialogTitle>
      <DialogContent className={styles.contentToDelete}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <FormControlLabel
            control={
              <Switch
                checked={deleteMode === 'period'}
                className={styles.switcher}
                onChange={handleModeChange}
                size="small"
              />
            }
            label={deleteMode === 'period' ? 'Удалить период смен' : 'Удалить одну смену'}
            className={styles.editModeControl}
          />

          {deleteMode === 'single' ? (
            <Box className={styles.info}>
              <TextField
                select
                fullWidth
                label="Дата удаляемой смены"
                value={startDate?.format('YYYY-MM-DD') || ''}
                onChange={handleDateSelect}
                className={styles.picker}
              >
                {shiftDates.map((date) => (
                  <MenuItem key={date.format('YYYY-MM-DD')} value={date.format('YYYY-MM-DD')}>
                    {date.locale('ru').format('dd, DD MMMM YYYY')}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ) : (
            <Grid2 container className={styles.datePickers}>
              <Grid2 className={styles.datePicker}>
                <DatePicker
                  label="Дата начала периода"
                  value={startDate}
                  onChange={handlePeriodStartChange}
                  minDate={minDate}
                  maxDate={endDate || maxDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid2>
              <Grid2 className={styles.datePicker}>
                <DatePicker
                  label="Дата конца периода"
                  value={endDate}
                  onChange={handlePeriodEndChange}
                  minDate={startDate || minDate}
                  maxDate={maxDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid2>
            </Grid2>
          )}
        </LocalizationProvider>
      </DialogContent>
      <DialogActions className={styles.deleteActions}>
        <Button onClick={handleClose} color="secondary">
          Отмена
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" disabled={!canConfirm}>
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ModalSelectDatesToDelete;

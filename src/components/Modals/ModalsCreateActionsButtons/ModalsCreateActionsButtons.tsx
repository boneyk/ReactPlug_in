import { FC } from 'react';

import { Alert, AlertTitle, Button, Grid2 } from '@mui/material';
import { createShift } from 'api/shedule_service';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { baseLayoutStore } from 'stores/baseLayout.store';
import { modalCreateStore } from 'stores/modalCreate.store';
import { useStores } from 'stores/useStores';

import { handleNetworkError } from 'utils/errorHandlers';

import styles from './ModalsCreateActionsButtons.module.scss';

interface ModalCreateActionsButtonsProps {
  onClose: () => void;
}
export const ModalCreateActionsButtons: FC<ModalCreateActionsButtonsProps> = observer(({ onClose }) => {
  const { timetableStore } = useStores();
  const { selectedRole, selectedEmployee } = timetableStore;
  const { errors, isValid, createShiftDto } = modalCreateStore;
  const canSave = isValid && !!selectedRole && !!selectedEmployee;

  const errorText =
    errors.start ||
    errors.end ||
    (!selectedRole && 'Не выбрана должность') ||
    (!selectedEmployee && 'Не выбран сотрудник');

  const onSubmit = async () => {
    if (!createShiftDto) return;
    try {
      await createShift(createShiftDto);
      if (timetableStore.selectedOffice) {
        await timetableStore.fetchSchedule(timetableStore.selectedOffice.id, timetableStore.year, timetableStore.month);
      }
      onClose();
    } catch (err: unknown) {
      let message = 'Ошибка при удалении смены';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      handleNetworkError(err);
    }
  };

  return (
    <Grid2 container className={styles.wrapper}>
      {errorText && (
        <Alert severity="error" className={styles.alert}>
          <AlertTitle>Ошибка</AlertTitle>
          {errorText}
        </Alert>
      )}
      <Button variant="contained" onClick={onSubmit} disabled={!canSave} className={styles.actionButton}>
        Сохранить
      </Button>
    </Grid2>
  );
});

import { FC, useState } from 'react';

import { Backdrop, Button, CircularProgress, Grid2 } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';

import { handleNetworkError } from '@/utils/errorHandlers';

import styles from './ModalsCreateActionsButtons.module.scss';
import { queryClient, scheduleKey } from '@/api/queries';
import { createShift, editShift } from '@/api/shedule_service';
import { baseLayoutStore } from '@/stores/baseLayout.store';
import { modalCreateStore } from '@/stores/modalCreate.store';
import { useStores } from '@/stores/useStores';

interface ModalCreateActionsButtonsProps {
  onClose: () => void;
  isEdit: boolean;
}

export const ModalCreateActionsButtons: FC<ModalCreateActionsButtonsProps> = observer(({ onClose, isEdit }) => {
  const { timetableStore } = useStores();
  const { selectedRole, selectedEmployee, selectedOffice, year, month } = timetableStore;

  const { errors, createShiftDto, editShiftDto, shiftId, editMode, shiftIdsForPeriod } = modalCreateStore;

  const [isLoading, setIsLoading] = useState(false);

  const errorText =
    errors.start ||
    errors.end ||
    (!selectedRole && 'Не выбрана должность') ||
    (!selectedEmployee && 'Не выбран сотрудник');

  const onSubmit = async () => {
    if (errorText) {
      baseLayoutStore.showWarning(errorText);
      return;
    }

    setIsLoading(true);
    if (!selectedOffice) return;

    try {
      if (!isEdit) {
        if (!createShiftDto) return;
        await createShift(createShiftDto);
        baseLayoutStore.showSuccess('Смена успешно создана');
        onClose();
      } else {
        if (!editShiftDto) return;
        if (editMode === 'period') {
          if (shiftIdsForPeriod.length === 0) return;
          await Promise.all(shiftIdsForPeriod.map((id) => editShift(id, editShiftDto)));
          baseLayoutStore.showSuccess(`Успешно отредактировано смен: ${shiftIdsForPeriod.length}`);
        } else {
          if (!shiftId) return;
          await editShift(shiftId, editShiftDto);
          baseLayoutStore.showSuccess('Смена успешно отредактирована');
        }
        onClose();
      }
      queryClient.invalidateQueries({
        queryKey: scheduleKey(selectedOffice.id, year, month)
      });
    } catch (err: unknown) {
      let message = 'Ошибка при сохранении смены';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      handleNetworkError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid2 container className={styles.wrapper}>
      <Button variant="contained" onClick={onSubmit} disabled={isLoading} className={styles.actionButton}>
        Сохранить
      </Button>
      <Backdrop open={isLoading} className={styles.overlay}>
        <CircularProgress />
      </Backdrop>
    </Grid2>
  );
});

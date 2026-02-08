import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { observer } from 'mobx-react-lite';

import SpinCentered from '@/components/spin-centered/SpinCentered';

import { handleNetworkError } from '@/utils/errorHandlers';

import styles from './ModalDelete.module.scss';
import { queryClient, scheduleKey } from '@/api/queries';
import { deleteShift } from '@/api/shedule_service';
import { baseLayoutStore } from '@/stores/baseLayout.store';
import { modalDeleteStore } from '@/stores/modalDelete.store';
import { modalViewStore } from '@/stores/modalView.store';
import { useStores } from '@/stores/useStores';

dayjs.locale('ru');

const ModalDelete = observer(() => {
  const { timetableStore } = useStores();
  const { isOpen, shiftId, shiftData, startDate, endDate, deleteMode } = modalDeleteStore;
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (shiftData) {
      modalViewStore.open(shiftData);
    }
    modalDeleteStore.close();
  };

  const getConfirmationText = () => {
    if (!startDate) return 'Вы уверены, что хотите удалить эту смену?';

    if (deleteMode === 'single' || startDate.isSame(endDate, 'day')) {
      return `Вы уверены, что хотите удалить смену ${startDate.locale('ru').format('DD MMMM YYYY')}?`;
    }

    return `Вы уверены, что хотите удалить смены с ${startDate.locale('ru').format('DD MMMM YYYY')} по ${endDate?.locale('ru').format('DD MMMM YYYY')}?`;
  };

  const handleDelete = async () => {
    if (!shiftId || !shiftData || !timetableStore.selectedOffice) return;
    setIsLoading(true);
    try {
      if (deleteMode === 'period' && startDate && endDate) {
        const shiftsToDelete: number[] = [];

        Object.values(timetableStore.shifts).forEach((employeeSchedules) => {
          employeeSchedules.forEach((employeeSchedule) => {
            if (employeeSchedule.employeeId === shiftData.employeeId) {
              employeeSchedule.shifts.forEach((shift) => {
                const shiftDate = dayjs(shift.scheduledOn);
                if (
                  (shiftDate.isAfter(startDate, 'day') || shiftDate.isSame(startDate, 'day')) &&
                  (shiftDate.isBefore(endDate, 'day') || shiftDate.isSame(endDate, 'day'))
                ) {
                  shiftsToDelete.push(shift.id);
                }
              });
            }
          });
        });

        for (const shiftIdToDelete of shiftsToDelete) {
          await deleteShift(shiftIdToDelete);
        }
        baseLayoutStore.showSuccess(`Успешно удалено смен: ${shiftsToDelete.length}`);
      } else {
        await deleteShift(shiftId);
      }

      await queryClient.invalidateQueries({
        queryKey: scheduleKey(timetableStore.selectedOffice?.id, timetableStore.year, timetableStore.month)
      });
      modalDeleteStore.close();
    } catch (error: unknown) {
      let message = 'Ошибка при удалении смены';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      handleNetworkError(error);
      modalDeleteStore.close();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className={styles.wrapper}>
      <DialogTitle className={styles.title}>Подтверждение удаления</DialogTitle>
      <DialogContent className={styles.content}>{getConfirmationText()}</DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={handleClose} color="secondary" disabled={isLoading}>
          Отмена
        </Button>
        <Button onClick={handleDelete} color="primary" variant="contained" disabled={isLoading}>
          Удалить
        </Button>
      </DialogActions>
      <SpinCentered loading={isLoading} overlay />
    </Dialog>
  );
});

export default ModalDelete;

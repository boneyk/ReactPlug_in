import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2 } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';

import ModalAddWorkerContent from '@/components/Modals/ModalAddWorkerContent';

import { GridRowSelectionModel } from '@mui/x-data-grid';

import styles from './ModalAddWorker.module.scss';
import { addEmployees } from '@/api/employees_service';
import { employeeIdsByOfficeKey, queryClient, scheduleKey } from '@/api/queries';
import { baseLayoutStore } from '@/stores/baseLayout.store';
import { timetableStore } from '@/stores/timetable.store';
import { useStores } from '@/stores/useStores';

const ModalAddWorker = observer(() => {
  const { employeesStore } = useStores();
  const { setAddEmployeeDialogVisibility, isEmployeeDialogVisible } = employeesStore;

  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);

  const closeDialog = () => {
    setAddEmployeeDialogVisibility(false);
  };

  const handleConfirm = async () => {
    const officeId = timetableStore.selectedOffice?.id;
    if (!officeId || selectedIds.length === 0) return;
    try {
      await addEmployees(officeId, selectedIds as number[]);
      await queryClient.invalidateQueries({
        queryKey: employeeIdsByOfficeKey(officeId)
      });
      await queryClient.invalidateQueries({
        queryKey: scheduleKey(officeId, timetableStore.year, timetableStore.month)
      });
      setSelectedIds([]);
      closeDialog();
    } catch (error) {
      let message = 'Ошибка при добавлении сотрудника';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
    }
  };

  return (
    <Dialog
      open={isEmployeeDialogVisible}
      onClose={closeDialog}
      scroll="paper"
      fullWidth
      className={styles.addDialog}
      slotProps={{
        backdrop: {
          className: styles.backdrop
        }
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <Grid2 container direction="row" className={styles.dialogWrapper}>
          <Grid2>Добавление сотрудника</Grid2>
          <Grid2>
            <Button onClick={closeDialog} variant="text" color="secondary">
              <CloseIcon className={styles.icon} />
            </Button>
          </Grid2>
        </Grid2>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <ModalAddWorkerContent onSelectionChange={setSelectedIds} />
      </DialogContent>
      <DialogActions className={styles.dialogActionsWrapper}>
        <Button
          variant="text"
          color="secondary"
          className={styles.actionButton}
          disabled={selectedIds.length === 0}
          onClick={handleConfirm}
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ModalAddWorker;

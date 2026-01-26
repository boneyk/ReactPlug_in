import { FC, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';
import { deleteShift } from 'api/shedule_service';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores/useStores';

import { isUserAdmin } from 'utils/auth';

import styles from '../../Modals/ModalView/ModalView.module.scss';
import { ShiftModalData } from '../ModalView/useViewModal';

interface ModalViewButtonsProps {
  onClose: () => void;
  shift: ShiftModalData;
}

export const ModalViewButtons: FC<ModalViewButtonsProps> = observer(({ onClose, shift }) => {
  const { timetableStore } = useStores();
  const { selectedOffice, year, month, fetchSchedule } = timetableStore;
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async () => {
    setDeleteError(null);
    if (!shift?.id) return;
    try {
      await deleteShift(shift.id);
      if (!selectedOffice) return;

      fetchSchedule(selectedOffice.id, year, month);
      onClose();
    } catch (error: unknown) {
      let message = 'Ошибка при удалении смены';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      setDeleteError(message);
    }
  };
  return (
    <>
      {deleteError && (
        <Alert severity="error">
          <AlertTitle>Ошибка удаления</AlertTitle>
          {deleteError}
        </Alert>
      )}
      <Stack direction="row" spacing={1} className={styles.stackPosition}>
        {isUserAdmin() && (
          <div>
            <IconButton>
              {/* TODO: добавить логику редактирования при нажатии на иконку (задача ORNG-134) */}
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteForeverIcon />
            </IconButton>
          </div>
        )}
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </>
  );
});

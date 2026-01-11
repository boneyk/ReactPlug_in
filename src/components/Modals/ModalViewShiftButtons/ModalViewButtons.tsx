import { FC, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';
import { deleteShift } from 'api/shedule_service';
import { timetableStore } from 'stores/timetable.store';

import styles from '../../Modals/ModalView/ModalView.module.scss';
import { ShiftModalData } from '../ModalView/useViewModal';

interface TimetableModalViewProps {
  onClose: () => void;
  shift: ShiftModalData;
}

export const ShiftButtons: FC<TimetableModalViewProps> = ({ onClose, shift }) => {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onDelete = async () => {
    setDeleteError(null);
    console.log(!shift?.id);
    if (!shift?.id) return;

    try {
      console.log(shift.id);
      await deleteShift(shift.id);
      await timetableStore.loadShifts(timetableStore.year, timetableStore.month + 1);
      onClose();
    } catch (err: any) {
      console.error('Ошибка при удалении смены', err);
      const message = err?.response?.data?.detail || 'Ошибка при удалении смены';
      setDeleteError(message);
    }
  };

  return (
    <>
      {deleteError && (
        <Alert severity="error" style={{ marginBottom: 8 }}>
          <AlertTitle>Ошибка удаления</AlertTitle>
          {deleteError}
        </Alert>
      )}
      <Stack direction="row" spacing={1} className={styles.stackPosition}>
        {localStorage.getItem('authorities') === 'ROLE_ADMIN' && (
          <>
            <IconButton>
              {/* TODO: добавить логику редактирования при нажатии на иконку (задача ORNG-134) */}
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteForeverIcon />
            </IconButton>
          </>
        )}
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </>
  );
};

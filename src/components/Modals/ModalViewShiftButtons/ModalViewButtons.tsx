import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';
import { deleteShift } from 'api/shedule_service';
import { timetableStore } from 'stores/timetable.store';

import styles from '../../Modals/ModalView/ModalView.module.scss';
import { useViewModal } from '../ModalView/useViewModal';

interface TimetableModalViewProps {
  onClose: () => void;
}

export const ShiftButtons: FC<TimetableModalViewProps> = ({ onClose }) => {
  const { selectedShift } = useViewModal();

  const onDelete = async () => {
    // if (!selectedShift?.id) return;

    try {
      // await deleteShift(selectedShift.id);
      await timetableStore.loadShifts(timetableStore.year, timetableStore.month);
      onClose();
    } catch (e) {
      console.error('Ошибка при удалении смены', e);
    }
  };

  return (
    <Stack direction="row" spacing={1} className={styles.stackPosition}>
      <IconButton>
        {/* TODO: добавить логику редактирования при нажатии на иконку (задача ORNG-134) */}
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete}>
        <DeleteForeverIcon />
      </IconButton>
      <IconButton aria-label="close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

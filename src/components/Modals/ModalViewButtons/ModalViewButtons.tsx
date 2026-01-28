import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';
import { deleteShift } from 'api/shedule_service';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { baseLayoutStore } from 'stores/baseLayout.store';
import { useStores } from 'stores/useStores';

import styles from '@/components/Modals/ModalView/ModalView.module.scss';

import { ShiftModalData } from '@/hooks/useViewModal';
import { handleNetworkError } from '@/utils/errorHandlers';
import { isUserAdmin } from 'utils/auth';

interface ModalViewButtonsProps {
  onClose: () => void;
  shift: ShiftModalData;
}

export const ModalViewButtons: FC<ModalViewButtonsProps> = observer(({ onClose, shift }) => {
  const { timetableStore } = useStores();

  const onDelete = async () => {
    if (!shift?.id) return;
    try {
      await deleteShift(shift.id);
      if (timetableStore.selectedOffice) {
        await timetableStore.fetchSchedule(timetableStore.selectedOffice.id, timetableStore.year, timetableStore.month);
      }
      onClose();
    } catch (error: unknown) {
      let message = 'Ошибка при удалении смены';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      handleNetworkError(error);
    }
  };
  return (
    <>
      <Stack direction="row" spacing={1} className={styles.stackPosition}>
        {isUserAdmin() && shift.type === 'work' && (
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

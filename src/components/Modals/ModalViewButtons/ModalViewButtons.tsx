import { FC, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Grid2, IconButton } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { baseLayoutStore } from 'stores/baseLayout.store';
import { useStores } from 'stores/useStores';

import Modal from '@/components/Modals/ModalCreate/ModalCreate';
import styles from '@/components/Modals/ModalView/ModalView.module.scss';

import { ShiftModalData } from '@/hooks/useViewModal';
import { handleNetworkError } from '@/utils/errorHandlers';
import { isUserAdmin } from 'utils/auth';

import { deleteShift } from '@/api/shedule_service';
import { modalCreateStore } from '@/stores/modalCreate.store';

interface ModalViewButtonsProps {
  onClose: () => void;
  shift: ShiftModalData;
}

export const ModalViewButtons: FC<ModalViewButtonsProps> = observer(({ onClose, shift }) => {
  const { timetableStore } = useStores();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    modalCreateStore.reset();
    onClose();
  };

  const handleOpen = () => {
    timetableStore.initRoleAndEmployee(shift.job, { id: shift.id, name: shift.fullname });
    const clickedDay = shift.dayIndex + 1;
    const clickedDate = dayjs().year(timetableStore.year).month(timetableStore.month).date(clickedDay);
    modalCreateStore.setStartDate(clickedDate);
    modalCreateStore.setEndDate(clickedDate);
    modalCreateStore.selectPreset(1);
    modalCreateStore.setShiftId(shift.id);
    setIsOpen(true);
  };

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
  const canEditAndDel = isUserAdmin() && shift.type === 'work';
  return (
    <>
      <Grid2 className={styles.stackPosition}>
        {canEditAndDel && (
          <>
            <IconButton onClick={handleOpen}>
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
      </Grid2>
      <Modal isOpen={isOpen} onClose={handleClose} isRoleSelectionDisabled={true} isEdit={true} />
    </>
  );
});

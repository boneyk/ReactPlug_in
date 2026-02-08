import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Grid2, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores/useStores';

import styles from '@/components/Modals/ModalView/ModalView.module.scss';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { ShiftModalData } from '@/hooks/useViewModal';
import { isUserAdmin } from 'utils/auth';

import { modalCreateStore } from '@/stores/modalCreate.store';
import { modalDeleteStore } from '@/stores/modalDelete.store';
import { modalSelectDatesToDeleteStore } from '@/stores/modalSelectDatesToDelete.store';

dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

interface ModalViewButtonsProps {
  onClose: () => void;
  shift: ShiftModalData;
}

export const ModalViewButtons: FC<ModalViewButtonsProps> = observer(({ onClose, shift }) => {
  const { timetableStore } = useStores();

  const handleOpen = () => {
    (document.activeElement as HTMLElement)?.blur();
    timetableStore.initRoleAndEmployee(shift.job, { id: shift.employeeId, name: shift.fullname });
    const clickedDay = shift.dayIndex + 1;
    const clickedDate = dayjs().year(timetableStore.year).month(timetableStore.month).date(clickedDay);

    modalCreateStore.setStartDate(clickedDate);
    modalCreateStore.setEndDate(clickedDate);
    modalCreateStore.selectPreset(1);
    modalCreateStore.setShiftId(shift.id);
    modalCreateStore.setShiftDates(shift.startDate, shift.endDate);
    onClose();
    modalCreateStore.open(true);
  };

  const onDelete = () => {
    if (!shift?.id) return;
    onClose();

    const startDate = dayjs(shift.startDate, 'DD-MM-YYYY');
    const endDate = dayjs(shift.endDate, 'DD-MM-YYYY');

    if (!startDate.isValid() || !endDate.isValid()) {
      return;
    }

    const shiftDates: dayjs.Dayjs[] = [];

    let currentDate = startDate;
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      shiftDates.push(currentDate);
      currentDate = currentDate.add(1, 'day');
    }

    if (shiftDates.length === 1) {
      modalDeleteStore.open(shift.id, shift, startDate, endDate, 'single');
    } else {
      modalSelectDatesToDeleteStore.open(shift, shiftDates);
    }
  };

  const canEditAndDel = isUserAdmin() && shift.type === 'work';

  return (
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
  );
});

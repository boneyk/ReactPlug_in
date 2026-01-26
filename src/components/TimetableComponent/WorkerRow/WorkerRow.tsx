import { FC } from 'react';

import { AddCircleOutline } from '@mui/icons-material';
import { Grid2, TableCell, TableRow } from '@mui/material';
import profileLogo from 'assets/profilePicture.svg';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import ModalView from 'components/Modals/ModalView/ModalView';

import { useCellClick } from '../../../hooks/useCellClick';
import { getShiftTitle, getShiftType, isEnd, isMid, isSolo, isStart } from '../../../utils/functions';

import { type EmployeeSchedule } from '../../../api/shedule_service';
import { useStores } from '../../../stores/useStores';
import Modal from '../../Modals/ModalCreate/ModalCreate';

import styles from './WorkerRow.module.scss';

interface WorkerRowProps {
  workerId: string;
  workerData: EmployeeSchedule;
  role: string;
}

const WorkerRow: FC<WorkerRowProps> = observer(({ workerId, workerData, role }) => {
  const { timetableStore } = useStores();
  const { days, daysInMonth, todayIndex, year, month } = timetableStore;
  const {
    daysShiftsList,
    createModalData,
    handleCellClick,
    closeCreateModal,
    isViewModalOpen,
    selectedShift,
    closeViewModal,
    canAddShift
  } = useCellClick({
    workerId,
    workerData,
    role,
    days,
    daysInMonth,
    year,
    month
  });

  return (
    <TableRow className={styles.hoverRow}>
      <TableCell className={classNames(styles.workerData, styles.stickyFirstCol)}>
        <Grid2 container className={styles.wrapper}>
          <img alt={''} src={profileLogo} className={styles.logo} />
          <span className={styles.fullName}>{workerData.fullName}</span>
        </Grid2>
      </TableCell>

      {days.map((day, index) => {
        const isStartOrSolo = isStart(daysShiftsList, index) || isSolo(daysShiftsList, index);

        return (
          <TableCell
            key={`worker-${workerId}-day-${day}`}
            className={styles.workerDayCell}
            onClick={() => handleCellClick(index)}
          >
            {!!daysShiftsList[index + 1] && (
              <span
                className={classNames(styles[getShiftType(daysShiftsList[index + 1])], styles.shift, {
                  [styles.startShift]: isStart(daysShiftsList, index),
                  [styles.endShift]: isEnd(daysShiftsList, index),
                  [styles.midShift]: isMid(daysShiftsList, index),
                  [styles.soloShift]: isSolo(daysShiftsList, index)
                })}
              >
                {isStartOrSolo && getShiftTitle(daysShiftsList, index)}
              </span>
            )}
            {!daysShiftsList[index + 1] && canAddShift(index) && (
              <AddCircleOutline className={styles.addIcon} fontSize="small" />
            )}
            {day === todayIndex && <div className={styles.pointer}></div>}
          </TableCell>
        );
      })}
      <Modal
        isOpen={createModalData.open}
        onClose={closeCreateModal}
        notEditable={false}
        defaultStartDate={createModalData.startDate}
      />
      <ModalView isOpen={isViewModalOpen} onClose={closeViewModal} shiftData={selectedShift} />
    </TableRow>
  );
});

export default WorkerRow;

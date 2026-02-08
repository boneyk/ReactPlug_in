import { FC, useState } from 'react';

import { AddCircleOutline } from '@mui/icons-material';
import { Grid2, TableCell, TableRow } from '@mui/material';
import profileLogo from 'assets/profilePicture.svg';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useCellClick } from '@/hooks/useCellClick';
import { isUserAdmin } from '@/utils/auth';

import styles from './WorkerRow.module.scss';
import { getShiftKey, getShiftTitle, getShiftType, isEnd, isMid, isSolo, isStart } from '@/lib/schedule';
import { useStores } from '@/stores/useStores';

interface WorkerRowProps {
  employeeId: number;
  role: string;
}

const WorkerRow: FC<WorkerRowProps> = observer(({ role, employeeId }) => {
  const [hoveredShiftKey, setHoveredShiftKey] = useState<string | null>(null);
  const { timetableStore } = useStores();
  const { days, daysInMonth, todayIndex, year, month, shifts } = timetableStore;
  const workerData = shifts[role]?.[employeeId];
  const { daysShiftsList, handleCellClick, canAddShift, isOfficeWorkingDay } = useCellClick({
    role,
    employeeId,
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
        const isHoliday = !isOfficeWorkingDay(index);
        const isNotEmpty = !!daysShiftsList[index + 1];
        const isDayAfterYesterday = new Date() <= new Date(timetableStore.year, timetableStore.month, day + 2);
        const clickableNotAdmin = !isUserAdmin() && isNotEmpty;
        const clickableAdmin = isUserAdmin() && (isNotEmpty || (!isHoliday && isDayAfterYesterday));
        const clickable = clickableAdmin || clickableNotAdmin;

        return (
          <TableCell
            key={`worker-${employeeId}-day-${day}`}
            className={classNames(styles.workerDayCell, {
              [styles.holiday]: isHoliday,
              [styles.clickable]: clickable,
              [styles.notClickable]: !clickable,
              [styles.hasShift]: isNotEmpty
            })}
            onClick={(e) => {
              e.stopPropagation();
              handleCellClick(index);
            }}
          >
            {!!daysShiftsList[index + 1] && (
              <span
                className={classNames(styles[getShiftType(daysShiftsList[index + 1])], styles.shift, {
                  [styles.startShift]: isStart(daysShiftsList, index),
                  [styles.endShift]: isEnd(daysShiftsList, index),
                  [styles.midShift]: isMid(daysShiftsList, index),
                  [styles.soloShift]: isSolo(daysShiftsList, index),
                  [styles.highlighted]: hoveredShiftKey === getShiftKey(daysShiftsList[index + 1])
                })}
                onMouseEnter={() => setHoveredShiftKey(getShiftKey(daysShiftsList[index + 1]))}
                onMouseLeave={() => setHoveredShiftKey(null)}
              >
                {isStartOrSolo && getShiftTitle(daysShiftsList, index)}
              </span>
            )}
            {isUserAdmin() && !daysShiftsList[index + 1] && canAddShift(index) && (
              <Grid2 className={styles.iconWrapper}>
                <AddCircleOutline className={styles.addIcon} fontSize="small" />
              </Grid2>
            )}
            {day === todayIndex && <div className={styles.pointer}></div>}
          </TableCell>
        );
      })}
    </TableRow>
  );
});

export default WorkerRow;

import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Grid2, Table, TableBody, TableCell, TableRow } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { formatTime, getCalendarMatrix, ScheduleMyItem } from '../../../utils/functions';

import { useStores } from '../../../stores/useStores';
import SpinCentered from '../../spin-centered/SpinCentered';

import styles from './CalendarGrid.module.scss';

const shiftTypeLabels: Record<string, string> = {
  VACATION: 'Отпуск',
  SICK_LEAVE: 'Болезнь',
  DAY_OFF: 'Выходной'
};

const shiftTypeClasses: Record<string, string> = {
  work: 'work',
  VACATION: 'vacation',
  SICK_LEAVE: 'sick',
  DAY_OFF: 'vacation'
};

const formatShiftLabel = (shift: ScheduleMyItem): string => {
  if (shift.type === 'work') {
    return `${shift.officeName}, ${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
  }
  return shiftTypeLabels[shift.type] || shift.type;
};

const getShiftClassName = (type: string): string => {
  return shiftTypeClasses[type] || 'work';
};

const CalendarGrid = observer(() => {
  const { timetableStore } = useStores();
  const { myScheduleMatrix, month, year, isMyScheduleLoading } = timetableStore;
  const location = useLocation();
  const isMySchedulePage = location.pathname === '/schedule/my';

  const emptyCalendarMatrix = useMemo(() => {
    const matrix = getCalendarMatrix(year, month);
    return matrix.map((week) =>
      week.map((cell) => {
        const [day, cellMonth] = cell.split('|').map(Number);
        return { day, month: cellMonth, myShifts: [] };
      })
    );
  }, [year, month]);

  const calendarMatrix = isMySchedulePage ? myScheduleMatrix : emptyCalendarMatrix;

  useEffect(() => {
    if (isMySchedulePage) {
      void timetableStore.fetchScheduleMy();
    }
  }, [isMySchedulePage, year, month, timetableStore]);

  return isMyScheduleLoading && isMySchedulePage ? (
    <SpinCentered overlay />
  ) : (
    <Table className={styles.calendarGrid}>
      <TableBody>
        {calendarMatrix.map((calendarRow, rowIndex) => (
          <TableRow key={rowIndex}>
            {calendarRow.map((cell, cellIndex) => {
              const isNotCurrentMonth = cell.month !== month;

              return (
                <TableCell
                  colSpan={1}
                  rowSpan={1}
                  key={cellIndex}
                  className={classNames(styles.gridCell, {
                    [styles.notCurrentMonthCell]: isNotCurrentMonth
                  })}
                >
                  <Grid2 container className={styles.wrapper}>
                    <span className={styles.date}>{cell.day}</span>
                    <Grid2 className={styles.myShifts}>
                      {isMySchedulePage &&
                        cell.myShifts.map((shift, shiftIndex) => (
                          <span key={shiftIndex} className={styles[getShiftClassName(shift.type)]}>
                            {formatShiftLabel(shift)}
                          </span>
                        ))}
                    </Grid2>
                  </Grid2>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

export default CalendarGrid;

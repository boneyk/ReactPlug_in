import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Grid2, Table, TableBody, TableCell, TableRow } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import SpinCentered from '@/components/spin-centered/SpinCentered';

import { shortWeekdays } from '@/constants/calendar';

import styles from './CalendarGrid.module.scss';
import { formatShiftLabel, getCalendarMatrix, getShiftClassName } from '@/lib/schedule';
import { useStores } from '@/stores/useStores';

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
      timetableStore.fetchMySchedule();
    }
  }, [isMySchedulePage, year, month, timetableStore]);

  if (isMyScheduleLoading && isMySchedulePage) return <SpinCentered overlay />;

  return (
    <>
      <Grid2 container className={styles.weekDays}>
        <Box className={styles.weekDay}>Понедельник</Box>
        <Box className={styles.weekDay}>Вторник</Box>
        <Box className={styles.weekDay}>Среда</Box>
        <Box className={styles.weekDay}>Четверг</Box>
        <Box className={styles.weekDay}>Пятница</Box>
        <Box className={styles.weekDay}>Суббота</Box>
        <Box className={styles.weekDay}>Воскресенье</Box>
      </Grid2>
      <Table className={styles.calendarGrid}>
        <TableBody>
          {calendarMatrix.map((calendarRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {calendarRow.map((cell, cellIndex) => {
                const isNotCurrentMonth = cell.month !== month;
                const isCurrentDay =
                  cell.month === month && cell.day === new Date().getDate() && year === new Date().getFullYear();

                return (
                  <TableCell
                    colSpan={1}
                    rowSpan={1}
                    key={cellIndex}
                    className={classNames(styles.gridCell, {
                      [styles.notCurrentMonthCell]: isNotCurrentMonth,
                      [styles.currentDay]: isCurrentDay
                    })}
                  >
                    <Grid2 container className={styles.wrapper}>
                      <Grid2 container className={styles.dateWeekday}>
                        <span className={styles.date}>{cell.day}</span>
                        <span className={styles.weekday}>{shortWeekdays[cellIndex]}</span>
                      </Grid2>
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
    </>
  );
});

export default CalendarGrid;

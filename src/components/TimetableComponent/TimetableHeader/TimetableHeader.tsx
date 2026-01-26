import { useEffect } from 'react';

import { Grid2, TableCell, TableHead, TableRow } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { getWeekdayByDate } from '../../../utils/functions';

import { useStores } from '../../../stores/useStores';

import styles from './TimetableHeader.module.scss';

const TimetableHeader = observer(() => {
  const { timetableStore } = useStores();
  const { shifts, year, month, days, changeMonth, todayIndex } = timetableStore;

  const totalWorkers = Object.values(shifts).reduce((sum, workersByRole) => sum + Object.keys(workersByRole).length, 0);

  useEffect(() => {
    changeMonth(month);
  }, [year, month, changeMonth]);

  return (
    <TableHead>
      <TableRow className={styles.headRow}>
        <TableCell className={classNames(styles.fullnameCountCell, styles.stickyFirstColHead)}>
          <Grid2 container direction="row" className={styles.fullnameCount}>
            {'ФИО сотрудника'}
            <div className={styles.counter}>{totalWorkers}</div>
          </Grid2>
        </TableCell>
        {days.map((index) => (
          <TableCell
            key={`${year}-${month}-${index}`}
            className={classNames(styles.monthDate, {
              [styles.lastCell]: index === days.length - 1,
              [styles.currentCell]: index === todayIndex
            })}
          >
            <Grid2 container direction="column" className={styles.wrapper}>
              <div className={styles.dateNum}>{index + 1}</div>
              <div className={classNames(styles.weekDay, { [styles.currentText]: index === todayIndex })}>
                {getWeekdayByDate(year, month, index + 1)}
              </div>
            </Grid2>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

export default TimetableHeader;

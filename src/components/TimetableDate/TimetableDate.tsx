import { FC } from 'react';

import arrowBack from 'assets/move-back-arrow.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { monthList } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';

import styles from './TimetableDate.module.scss';

interface TimetableDateProps {
  className?: string;
}

const TimetableDate: FC<TimetableDateProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const curDate = new Date();

  return (
    <div className={classNames(className, styles['timetable__header-date'])}>
      <h1 className={styles['day-month']}>
        {curDate.getDate()} {monthList[curDate.getMonth()]}
      </h1>

      <h1 className={styles['year']}>{timetableStore.year}</h1>

      <button
        className={classNames(styles['timetable__header-button'], 'decrease')}
        onClick={() => timetableStore.decYear()}
        type="button"
      >
        <img src={arrowBack} alt="-" />
      </button>

      <button
        className={classNames(styles['timetable__header-button'], 'increase')}
        onClick={() => timetableStore.incYear()}
        type="button"
      >
        <img src={arrowForward} alt="+" />
      </button>
    </div>
  );
});

export default TimetableDate;

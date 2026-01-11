import { FC } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { getWeekdayByDate } from '../../utils/functions';

import { useStores } from '../../stores/useStores';

import styles from './TimetableGridDayHeaderCell.module.scss';

interface TimetableGridDayHeaderCellProps {
  index: number;
  todayIndex: number;
}

const TimetableGridDayHeaderCell: FC<TimetableGridDayHeaderCellProps> = observer(({ index, todayIndex }) => {
  const { timetableStore } = useStores();

  return (
    <div className={classNames(styles['cell'], { [styles['current-date']]: index === todayIndex })}>
      <div className={classNames(styles['cell-content'], { [styles['current-cell-content']]: index === todayIndex })}>
        {index + 1}
        <div
          className={classNames(styles['weekday-name'], {
            [styles['current-date-weekday']]: index === todayIndex
          })}
        >
          {getWeekdayByDate(timetableStore.year, timetableStore.month, index + 1)}
        </div>
      </div>
    </div>
  );
});

export default TimetableGridDayHeaderCell;

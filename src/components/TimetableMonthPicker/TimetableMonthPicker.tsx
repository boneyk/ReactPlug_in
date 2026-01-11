import { FC } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { monthList } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';

import styles from './TimetableMonthPicker.module.scss';

interface TimetableMonthPickerProps {
  className?: string;
}

const TimetableMonthPicker: FC<TimetableMonthPickerProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const handleRequest = async () => {
    try {
      timetableStore.loadShifts(timetableStore.year, timetableStore.month + 1);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        console.log(err.response.data.detail);
      }
    }
  };
  return (
    <div className={classNames(className, styles['month-switcher'])}>
      {monthList.map((month, idx) => (
        <button
          key={`${month}-${idx}`}
          className={classNames(styles['month-button'], { [styles['choosen']]: timetableStore.month === idx })}
          onClick={() => {
            timetableStore.changeMonth(idx);
            handleRequest();
          }}
          type="button"
        >
          {month}
        </button>
      ))}
    </div>
  );
});

export default TimetableMonthPicker;

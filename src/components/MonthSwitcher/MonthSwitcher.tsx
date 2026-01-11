import { FC } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { monthList } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';

import styles from './MonthSwitcher.module.scss';

interface MonthSwitcherProps {
  className?: string;
}

const MonthSwitcher: FC<MonthSwitcherProps> = observer(({ className }) => {
  const { timetableStore } = useStores();

  return (
    <div className={classNames(className, styles['month-switcher'])}>
      {monthList.map((month, idx) => (
        <button
          key={`${month}-${idx}`}
          className={classNames(styles['month-button'], { [styles['choosen']]: timetableStore.month === idx })}
          onClick={() => timetableStore.changeMonth(idx)}
          type="button"
        >
          {month}
        </button>
      ))}
    </div>
  );
});

export default MonthSwitcher;

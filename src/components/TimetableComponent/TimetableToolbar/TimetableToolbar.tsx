import classNames from 'classnames';

import TimetableCurrentDateYear from '../TimetableCurrentDateYear';
import TimetableMonthPicker from '../TimetableMonthPicker';

import styles from './TimetableToolbar.module.scss';

const TimetableToolbar = () => {
  return (
    <div className={classNames(styles['timetable-header'])}>
      <TimetableCurrentDateYear></TimetableCurrentDateYear>
      <TimetableMonthPicker></TimetableMonthPicker>
    </div>
  );
};

export default TimetableToolbar;

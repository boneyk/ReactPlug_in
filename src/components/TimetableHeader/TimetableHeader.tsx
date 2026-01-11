import classNames from 'classnames';

import MonthSwitcher from '../MonthSwitcher';
import TimetableDate from '../TimetableDate';

import styles from './TimetableHeader.module.scss';

const TimetableHeader = () => {
  return (
    <div className={classNames(styles['timetable-header'])}>
      <TimetableDate></TimetableDate>
      <MonthSwitcher></MonthSwitcher>
    </div>
  );
};

export default TimetableHeader;

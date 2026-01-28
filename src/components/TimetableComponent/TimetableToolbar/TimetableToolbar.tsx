import { FC } from 'react';

import classNames from 'classnames';

import TimetableCurrentDateYear from '../TimetableCurrentDateYear';
import TimetableMonthPicker from '../TimetableMonthPicker';

import styles from './TimetableToolbar.module.scss';

interface TimetableToolbarProps {
  showDropdown?: boolean;
}

const TimetableToolbar: FC<TimetableToolbarProps> = ({ showDropdown = true }) => {
  return (
    <div className={classNames(styles['timetable-header'])}>
      <TimetableCurrentDateYear showDropdown={showDropdown}></TimetableCurrentDateYear>
      <TimetableMonthPicker></TimetableMonthPicker>
    </div>
  );
};

export default TimetableToolbar;

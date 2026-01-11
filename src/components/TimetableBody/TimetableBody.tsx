import { FC } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import TimetableCalendar from '../TimetableCalendar';
import TimetableWorkers from '../TimetableWorkers';

import styles from './TimetableBody.module.scss';

interface TimetableBodyProps {
  className?: string;
}

const TimetableBody: FC<TimetableBodyProps> = observer(({ className }) => {
  return (
    <div className={classNames(className, styles['timetable-body'])}>
      <TimetableWorkers></TimetableWorkers>
      <TimetableCalendar></TimetableCalendar>
    </div>
  );
});

export default TimetableBody;

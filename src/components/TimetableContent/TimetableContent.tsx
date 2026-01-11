import { FC } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import TimetableGrid from '../TimetableGrid';
import TimetableWorkersSidebar from '../TimetableWorkersSidebar';

import styles from './TimetableContent.module.scss';

interface TimetableContentProps {
  className?: string;
}

const TimetableContent: FC<TimetableContentProps> = observer(({ className }) => {
  return (
    <div className={classNames(className, styles['timetable-body'])}>
      <TimetableWorkersSidebar></TimetableWorkersSidebar>
      <TimetableGrid></TimetableGrid>
    </div>
  );
});

export default TimetableContent;

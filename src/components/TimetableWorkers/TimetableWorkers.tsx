import { FC, memo } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useStores } from '../../stores/useStores';

import styles from './TimetableWorkers.module.scss';

interface TimetableWorkersProps {
  className?: string;
}

const TimetableWorkers: FC<TimetableWorkersProps> = observer(({ className }) => {
  const { timetableStore } = useStores();

  const totalWorkers = Object.values(timetableStore.shifts).reduce(
    (sum, workersByRole) => sum + Object.keys(workersByRole).length,
    0
  );

  return (
    <div className={classNames(className, styles['timetable-workers'])}>
      <div className={styles['workers-counter']}>
        {'ФИО сотрудника'} <div className={styles['counter']}>{totalWorkers}</div>
      </div>
      {Object.entries(timetableStore.shifts).map(([job, workersByRole]) => (
        <div key={job}>
          <div className={styles['role']}>{job}</div>

          {Object.entries(workersByRole).map(([fullname, workerData]) => (
            <div key={`${job}-${fullname}`} className={styles['worker-cell']}>
              <div className={styles['worker-pic__container']}></div>
              <div className={styles['worker']}>
                <div className={styles['fullname']}>{fullname}</div>
                <div className={styles['phone']}>{workerData.phone}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default memo(TimetableWorkers);

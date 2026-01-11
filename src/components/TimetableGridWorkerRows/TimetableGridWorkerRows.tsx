import { useEffect, useMemo } from 'react';

import { observer } from 'mobx-react-lite';

import { buildWorkerBlocks, getMonthDaysCount, groupBlocksByStart } from '../../utils/functions';

import { useStores } from '../../stores/useStores';
import TimetableGridWorkerRow from '../TimetableGridWorkerRow';

import styles from './TimetableGridWorkerRows.module.scss';

const TimetableGridWorkerRows = observer(() => {
  const { timetableStore } = useStores();

  const { year, month, shifts, daysInMonth, changeDaysInMonth } = timetableStore;

  useEffect(() => {
    changeDaysInMonth(getMonthDaysCount(year, month));
  }, [changeDaysInMonth, year, month]);

  const rows = useMemo(() => {
    return Object.entries(shifts).map(([job, workersByRole]) => ({
      job,
      workers: Object.entries(workersByRole).map(([workerId, worker]) => {
        const blocks = buildWorkerBlocks(worker, year, month, daysInMonth);
        const blocksByStart = groupBlocksByStart(blocks);

        return { workerId, worker, blocksByStart };
      })
    }));
  }, [shifts, year, month, daysInMonth]);
  return (
    <div className={styles['timetable-workers-calendar']}>
      {rows.map(({ job, workers }) => (
        <div key={job}>
          <div className={styles['blank-line']} />

          {workers.map(({ workerId, worker, blocksByStart }) => (
            <TimetableGridWorkerRow
              key={`${job}-${workerId}`}
              workerId={workerId}
              worker={worker}
              blocksByStart={blocksByStart}
              job={job}
              workerData={worker}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default TimetableGridWorkerRows;

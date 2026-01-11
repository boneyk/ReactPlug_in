import { CSSProperties, FC, RefObject, useMemo } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { CELL_W } from '../../constants/timetable';
import { getMonthDaysCount } from '../../utils/functions';

import { useStores } from '../../stores/useStores';
import TimetableGridDayHeaderCell from '../TimetableGridDayHeaderCell';
import TimetableGridWorkerRows from '../TimetableGridWorkerRows';

import styles from './TimetableGridTape.module.scss';

interface TimetableGridTapeProps {
  tapeRef: RefObject<HTMLDivElement | null>;
  curMonth: boolean;
}

const TimetableGridTape: FC<TimetableGridTapeProps> = observer(({ tapeRef, curMonth }) => {
  const { timetableStore } = useStores();

  const daysInMonth = getMonthDaysCount(timetableStore.year, timetableStore.month);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i), [daysInMonth]);

  const todayIndex = useMemo(() => {
    const date = new Date();
    if (date.getFullYear() !== timetableStore.year || date.getMonth() !== timetableStore.month) return -1;
    return date.getDate() - 1;
  }, [timetableStore.year, timetableStore.month]);

  const todayBaseLeftPx = useMemo(() => {
    if (todayIndex < 0) return 0;

    const LINE_W = 2;
    return todayIndex * CELL_W + (CELL_W / 2 - LINE_W / 2);
  }, [todayIndex]);

  const workersHighlightHeightPx = useMemo(() => {
    const rolesCount = Object.keys(timetableStore.shifts).length;

    const peopleCount = Object.values(timetableStore.shifts).reduce((acc, workersByRole) => {
      return acc + Object.keys(workersByRole).length;
    }, 0);

    return rolesCount * 32 + peopleCount * 60;
  }, [timetableStore.shifts]);

  const pointerStyles = {
    '--left-pointer-pos': `${todayBaseLeftPx}px`,
    '--height-pointer': `${workersHighlightHeightPx + 5}px`
  } as CSSProperties;

  return (
    <div
      ref={tapeRef}
      className={styles['calendar-tape']}
      style={{
        transform: `translateX(-${timetableStore.calendarTranslatePx}px)`
      }}
    >
      {curMonth && <div className={classNames(styles['pointer'])} style={pointerStyles} />}

      <div className={styles['timetable-calendar']}>
        {days.map((i) => (
          <TimetableGridDayHeaderCell
            index={i}
            todayIndex={todayIndex}
            key={`${timetableStore.year}-${timetableStore.month}-${i}`}
          />
        ))}
      </div>

      <TimetableGridWorkerRows />
    </div>
  );
});

export default TimetableGridTape;

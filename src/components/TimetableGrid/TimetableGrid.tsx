import { FC, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { getMonthDaysCount } from '../../utils/functions';

import { useStores } from '../../stores/useStores';
import TimetableGridTape from '../TimetableGridTape';

import styles from './TimetableGrid.module.scss';

interface TimetableGridProps {
  className?: string;
}

const TimetableGrid: FC<TimetableGridProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const daysInMonth = getMonthDaysCount(timetableStore.year, timetableStore.month);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const tapeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const tape = tapeRef.current;
    if (!viewport || !tape) return;

    const update = () => {
      const viewportW = viewport.clientWidth;
      const tapeW = tape.scrollWidth;
      const max = Math.max(0, tapeW - viewportW);

      timetableStore.setCalendarMaxTranslatePx(max);
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(viewport);
    resizeObserver.observe(tape);

    return () => resizeObserver.disconnect();
  }, [daysInMonth, timetableStore]);

  useEffect(() => {
    timetableStore.resetCalendarTranslate();
  }, [timetableStore.year, timetableStore.month, timetableStore]);

  const curMonth = useMemo(() => {
    const curDate = new Date();
    return curDate.getMonth() === timetableStore.month && curDate.getFullYear() === timetableStore.year;
  }, [timetableStore.month, timetableStore.year]);

  return (
    <div className={classNames(className, styles['calendar-wrap'])}>
      <div ref={viewportRef} className={styles['calendar-viewport']}>
        <TimetableGridTape tapeRef={tapeRef} curMonth={curMonth} />
      </div>
    </div>
  );
});

export default TimetableGrid;

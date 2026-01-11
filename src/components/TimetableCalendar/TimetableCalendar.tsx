import { FC, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useViewModal } from 'components/Modals/ModalView/useViewModal';

import { CELL_W } from '../../constants/timetable';
import { getMonthDaysCount, getWeekdayByDate } from '../../utils/functions';

import type { Shift, ShiftType, Worker } from '../../stores/timetable.store';
import { useStores } from '../../stores/useStores';
import Modal from '../Modals/ModalView/ModalView';

import styles from './TimetableCalendar.module.scss';

interface TimetableCalendarProps {
  className?: string;
}

type ShiftBlock = {
  id: number;
  startIdx: number;
  spanDays: number;
  type: ShiftType;
  text: string;
};

const parseYmd = (ymd: string) => new Date(`${ymd}T00:00:00`);

const clampShiftToMonth = (shift: Shift, year: number, month: number, daysInMonth: number) => {
  const monthStart = new Date(year, month, 1, 0, 0, 0);
  const monthEnd = new Date(year, month, daysInMonth, 0, 0, 0);

  const startDate = parseYmd(shift.startDate);
  const endDate = parseYmd(shift.endDate);

  const start = startDate < monthStart ? monthStart : startDate;
  const end = endDate > monthEnd ? monthEnd : endDate;

  if (end < start) return null;

  const startIdx = start.getDate() - 1;
  const endIdx = end.getDate() - 1;

  return { startIdx, endIdx };
};

const getShiftText = (shift: Shift) => {
  if (shift.type === 'work') return `${shift.startTime} - ${shift.endTime}`;
  return shift.label ?? (shift.type === 'vacation' ? 'Отпуск' : 'Больничный');
};

const buildWorkerBlocks = (worker: Worker, year: number, month: number, daysInMonth: number): ShiftBlock[] => {
  const shiftSegments: ShiftBlock[] = [];

  for (const shift of worker.shifts) {
    const clamped = clampShiftToMonth(shift, year, month, daysInMonth);
    if (!clamped) continue;

    const spanDays = clamped.endIdx - clamped.startIdx + 1;
    shiftSegments.push({
      id: shift.id,
      startIdx: clamped.startIdx,
      spanDays,
      type: shift.type,
      text: getShiftText(shift)
    });
  }

  shiftSegments.sort((a, b) => b.spanDays - a.spanDays);

  return shiftSegments;
};

const TimetableCalendar: FC<TimetableCalendarProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const daysInMonth = getMonthDaysCount(timetableStore.year, timetableStore.month);

  const todayIndex = useMemo(() => {
    const date = new Date();
    if (date.getFullYear() !== timetableStore.year || date.getMonth() !== timetableStore.month) return -1;
    return date.getDate() - 1;
  }, [timetableStore.year, timetableStore.month]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const tapeRef = useRef<HTMLDivElement | null>(null);

  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i), [daysInMonth]);

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

  const todayBaseLeftPx = useMemo(() => {
    if (todayIndex < 0) return 0;

    const LINE_W = 2;
    return todayIndex * CELL_W + (CELL_W / 2 - LINE_W / 2);
  }, [todayIndex]);

  const workersHighlightHeightPx = useMemo(() => {
    const vacanciesCount = Object.keys(timetableStore.shifts).length;

    const peopleCount = Object.values(timetableStore.shifts).reduce((acc, workersByRole) => {
      return acc + Object.keys(workersByRole).length;
    }, 0);

    return vacanciesCount * 32 + peopleCount * 60;
  }, [timetableStore.shifts]);

  const curMonth = useMemo(() => {
    const curDate = new Date();
    return curDate.getMonth() === timetableStore.month && curDate.getFullYear() === timetableStore.year;
  }, [timetableStore.month, timetableStore.year]);

  const { isOpen, selectedShift, openShiftModal, closeModal } = useViewModal();

  return (
    <div className={classNames(className, styles['calendar-wrap'])}>
      <div ref={viewportRef} className={styles['calendar-viewport']}>
        <div
          ref={tapeRef}
          className={styles['calendar-tape']}
          style={{
            transform: `translateX(-${timetableStore.calendarTranslatePx}px)`
          }}
        >
          {curMonth ? (
            <div
              className={classNames(styles['pointer'])}
              style={{
                ['--left-pointer-pos' as any]: `${todayBaseLeftPx}px`,
                ['--height-pointer' as any]: `${workersHighlightHeightPx + 5}px`
              }}
            />
          ) : null}

          <div className={styles['timetable-calendar']}>
            {days.map((i) => (
              <div
                key={`${timetableStore.year}-${timetableStore.month}-${i}`}
                className={classNames(styles['cell'], { [styles['current-date']]: i === todayIndex })}
              >
                <div
                  className={classNames(styles['cell-content'], { [styles['current-cell-content']]: i === todayIndex })}
                >
                  {i + 1}
                  <div
                    className={classNames(styles['weekday-name'], {
                      [styles['current-date-weekday']]: i === todayIndex
                    })}
                  >
                    {getWeekdayByDate(timetableStore.year, timetableStore.month, i + 1)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles['timetable-workers-calendar']}>
            {Object.entries(timetableStore.shifts).map(([job, workersByRole]) => (
              <div key={job}>
                <div className={styles['blank-line']} />

                {Object.entries(workersByRole).map(([workerId, workerData]) => {
                  const blocks = buildWorkerBlocks(workerData, timetableStore.year, timetableStore.month, daysInMonth);

                  const blocksByStart = new Map<number, ShiftBlock[]>();
                  for (const b of blocks) {
                    const arr = blocksByStart.get(b.startIdx) ?? [];
                    arr.push(b);
                    blocksByStart.set(b.startIdx, arr);
                  }

                  return (
                    <div key={`${job}-${workerId}`} className={styles['worker-row']}>
                      {days.map((dayIndex) => {
                        const startBlocks = blocksByStart.get(dayIndex) ?? [];
                        const hasStart = startBlocks.length > 0;

                        return (
                          <div
                            key={`${workerId}-${dayIndex}`}
                            className={classNames(styles['cell'], styles['worker-cell'], {
                              [styles['worker-cell--has-start']]: hasStart
                            })}
                          >
                            <div className={styles['worker-cell-content']}>
                              {startBlocks.map((b, idx) => (
                                <div
                                  key={`${workerId}-${dayIndex}-${b.type}-${idx}`}
                                  className={classNames(styles['shift'], styles[`shift--${b.type}` as const])}
                                  style={{
                                    width: `calc(${b.spanDays} * ${CELL_W}px - 8px)`
                                  }}
                                  title={b.text}
                                  onClick={() => {
                                    openShiftModal({
                                      id: b.id,
                                      fullname: workerData.fullName,
                                      job,
                                      dayIndex,
                                      type: b.type,
                                      text: b.text,
                                      spanDays: b.spanDays
                                    });
                                  }}
                                >
                                  {b.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} shiftData={selectedShift} />
    </div>
  );
});

export default memo(TimetableCalendar);

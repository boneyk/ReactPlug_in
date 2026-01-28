import { useEffect, useRef } from 'react';

import { Grid2, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import JobSection from '../JobSection';
import TimetableHeader from '../TimetableHeader';

import styles from './Timetable.module.scss';
import { useStores } from '@/stores/useStores';

const Timetable = observer(() => {
  const { timetableStore } = useStores();
  const { shifts, calendarTranslatePx, setCalendarMaxTranslatePx, setCalendarTranslatePx, daysInMonth, isLoading } =
    timetableStore;
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const jobTitles = Object.keys(shifts ?? {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMaxScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setCalendarMaxTranslatePx(maxScroll);
    };

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const scrollLeft = Math.round(container.scrollLeft);
      setCalendarTranslatePx(scrollLeft);
    };

    updateMaxScroll();

    const resizeObserver = new ResizeObserver(updateMaxScroll);
    resizeObserver.observe(container);

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [setCalendarMaxTranslatePx, setCalendarTranslatePx]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setCalendarMaxTranslatePx(maxScroll);
    });
  }, [daysInMonth, setCalendarMaxTranslatePx]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentScroll = Math.round(container.scrollLeft);
    if (currentScroll === calendarTranslatePx) return;

    isProgrammaticScroll.current = true;

    container.scrollTo({ left: calendarTranslatePx, behavior: 'smooth' });

    const updateScroll = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);

    return () => clearTimeout(updateScroll);
  }, [calendarTranslatePx]);

  return (
    <Grid2 container className={styles.wrapper}>
      <TableContainer ref={containerRef} component={Paper} className={styles.muitimetable}>
        <Table stickyHeader>
          <TimetableHeader />
          <TableBody>
            {isLoading && (
              <TableRow className={styles.loadingRow}>
                <TableCell className={classNames(styles.stickyFirstCol, styles.cell)}>
                  <Skeleton animation="pulse" className={styles.skeleton} />
                </TableCell>
                <TableCell colSpan={daysInMonth} className={styles.cell}>
                  <Skeleton animation="pulse" className={styles.skeleton} />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && jobTitles.map((jobTitle) => <JobSection key={`job-${jobTitle}`} jobTitle={jobTitle} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2>
  );
});

export default Timetable;

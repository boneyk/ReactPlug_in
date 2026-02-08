import { useEffect, useRef } from 'react';

import { Grid2, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import Modal from '@/components/Modals/ModalCreate/ModalCreate';
import ModalDelete from '@/components/Modals/ModalDelete/ModalDelete';
import ModalSelectDatesToDelete from '@/components/Modals/ModalSelectDatesToDelete/ModalSelectDatesToDelete';
import ModalView from '@/components/Modals/ModalView/ModalView';

import { isUserAdmin } from '@/utils/auth';

import JobSection from '../JobSection';
import TimetableHeader from '../TimetableHeader';

import styles from './Timetable.module.scss';
import { fetchSchedule, scheduleKey } from '@/api/queries';
import { modalCreateStore } from '@/stores/modalCreate.store';
import { useStores } from '@/stores/useStores';

const Timetable = observer(() => {
  const { timetableStore } = useStores();

  const {
    selectedOffice,
    year,
    month,
    calendarTranslatePx,
    setCalendarMaxTranslatePx,
    setCalendarTranslatePx,
    daysInMonth
  } = timetableStore;

  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const scheduleQuery = useQuery({
    queryKey: selectedOffice ? scheduleKey(selectedOffice.id, year, month) : ['schedule-disabled'],
    queryFn: fetchSchedule,
    enabled: !!selectedOffice
  });

  const isLoading = scheduleQuery.isLoading || !scheduleQuery.data;

  useEffect(() => {
    if (scheduleQuery.data) {
      timetableStore.shifts = scheduleQuery.data;
    }
  }, [scheduleQuery.data, timetableStore]);

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

    container.scrollTo({
      left: calendarTranslatePx,
      behavior: 'smooth'
    });

    const timer = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [calendarTranslatePx]);

  const jobTitles = Object.keys(scheduleQuery.data ?? {});

  return (
    <>
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
      {isUserAdmin() && (
        <Modal
          isOpen={modalCreateStore.isOpen}
          onClose={modalCreateStore.close}
          isRoleSelectionDisabled={true}
          isEdit={modalCreateStore.isEdit}
        />
      )}
      <ModalDelete />
      <ModalSelectDatesToDelete />
      <ModalView />
    </>
  );
});

export default Timetable;

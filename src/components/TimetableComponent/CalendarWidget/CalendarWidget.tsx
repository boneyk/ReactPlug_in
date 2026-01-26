import { FC, useEffect } from 'react';

import { Grid2 } from '@mui/material';

import { useStores } from '../../../stores/useStores';
import CalendarGrid from '../CalendarGrid';
import TimetableToolbar from '../TimetableToolbar';

import styles from './CalendarWidget.module.scss';

interface CalendarWidgetProps {
  title: string;
  showDropdown?: boolean;
}

const CalendarWidget: FC<CalendarWidgetProps> = ({ title, showDropdown = false }) => {
  const { timetableStore } = useStores();

  useEffect(() => {
    timetableStore.resetToCurrentDate();
  }, [timetableStore]);
  return (
    <Grid2 container className={styles.wrapper}>
      <Grid2 container className={styles.sectiolnName}>
        <h1>{title}</h1>
      </Grid2>
      <TimetableToolbar showDropdown={showDropdown} />
      <CalendarGrid />
    </Grid2>
  );
};

export default CalendarWidget;

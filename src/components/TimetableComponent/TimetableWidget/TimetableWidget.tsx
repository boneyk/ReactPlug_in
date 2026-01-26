import { useEffect } from 'react';

import { Grid2 } from '@mui/material';

import { useStores } from '../../../stores/useStores';
import Timetable from '../Timetable';
import TimetableControls from '../TimetableControls';
import TimetableToolbar from '../TimetableToolbar';

import styles from './TimetableWidget.module.scss';

const TimetableWidget = () => {
  const { timetableStore } = useStores();

  useEffect(() => {
    timetableStore.resetToCurrentDate();
  }, [timetableStore]);

  return (
    <div>
      <Grid2 container className={styles.sectiolnName}>
        <h1>{'График смен по офису'}</h1>
      </Grid2>
      <TimetableToolbar />
      <Timetable />
      <TimetableControls />
    </div>
  );
};

export default TimetableWidget;

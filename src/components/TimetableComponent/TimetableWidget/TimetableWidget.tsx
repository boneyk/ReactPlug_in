import { Grid2 } from '@mui/material';

import Timetable from '../Timetable';
import TimetableControls from '../TimetableControls';
import TimetableToolbar from '../TimetableToolbar';

import styles from './TimetableWidget.module.scss';

const TimetableWidget = () => {
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

import React, { useEffect } from 'react';

import Timetable from '../../components/Timetable';
import { timetableStore } from 'stores/timetable.store';

const TimetablePage = () => {
  useEffect(() => {
    timetableStore.loadShifts();
  }, []);
  return <Timetable></Timetable>;
};

export default TimetablePage;

import React, { useEffect } from 'react';

import { timetableStore } from 'stores/timetable.store';

import Timetable from '../../components/Timetable';

const TimetablePage = () => {
  useEffect(() => {
    timetableStore.loadShifts();
  }, []);
  return <Timetable></Timetable>;
};

export default TimetablePage;

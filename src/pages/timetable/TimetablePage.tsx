import React, { useEffect } from 'react';

import { timetableStore } from 'stores/timetable.store';

import TimetableWidget from '../../components/TimetableWidget';

const TimetablePage = () => {
  useEffect(() => {
    timetableStore.loadShifts();
  }, []);
  return <TimetableWidget />;
};

export default TimetablePage;

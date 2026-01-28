import { useEffect } from 'react';

import { timetableStore } from 'stores/timetable.store';

import TimetableWidget from '../../components/TimetableComponent';

import { isAuth } from 'utils/auth';

const TimetablePage = () => {
  useEffect(() => {
    if (isAuth()) {
      timetableStore.init();
    }
  }, []);
  return <TimetableWidget />;
};

export default TimetablePage;

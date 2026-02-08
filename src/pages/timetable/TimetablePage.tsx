import { useEffect } from 'react';

import TimetableWidget from '../../components/TimetableComponent';

import { useEmployeeOffices } from '@/hooks/useEmployeeOffices';

import { timetableStore } from '@/stores/timetable.store';

const TimetablePage = () => {
  const { employeeQuery, officesQuery, officesTimetableQuery } = useEmployeeOffices();

  useEffect(() => {
    if (
      !timetableStore.selectedOffice &&
      officesQuery.data?.length &&
      employeeQuery.data &&
      officesTimetableQuery.data
    ) {
      timetableStore.setSelectedOffice(officesQuery.data[0]);
      timetableStore.setOffices(officesQuery.data);
      timetableStore.setEmployee(employeeQuery.data);
      timetableStore.setOfficeTimetable(officesTimetableQuery.data);
    }
  }, [officesQuery.data, employeeQuery.data, officesTimetableQuery.data]);

  return <TimetableWidget />;
};

export default TimetablePage;

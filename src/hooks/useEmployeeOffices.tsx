import { useQuery } from '@tanstack/react-query';

import { decodeAuthToken } from '@/utils/auth';

import {
  employeeEntityKey,
  fetchEmployeeEntity,
  fetchOffices,
  fetchOfficeTimetable,
  officesKey,
  officeTimetableKey
} from '@/api/queries';

export const useEmployeeOffices = () => {
  const { userId } = decodeAuthToken(localStorage.getItem('accessToken'));

  const employeeQuery = useQuery({
    queryKey: userId ? employeeEntityKey(userId) : ['employee-disabled'],
    queryFn: fetchEmployeeEntity,
    enabled: !!userId
  });

  const employeeId = employeeQuery.data?.id;

  const officesQuery = useQuery({
    queryKey: employeeId ? officesKey(employeeId) : ['offices-disabled'],
    queryFn: fetchOffices,
    enabled: !!employeeId
  });

  const officesIds = officesQuery.data?.[0]?.id;

  const officesTimetableQuery = useQuery({
    queryKey: officesIds ? officeTimetableKey(officesIds) : ['officesTimetable-disabled'],
    queryFn: fetchOfficeTimetable,
    enabled: !!officesIds
  });

  return {
    employeeQuery,
    officesQuery,
    officesTimetableQuery
  };
};

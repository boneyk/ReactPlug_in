import { QueryClient, QueryFunctionContext } from '@tanstack/react-query';

import { isUserAdmin } from '@/utils/auth';

import {
  EmployeeEntityResponse,
  EmployeeResponse,
  getEmployeeEntity,
  getEmployeeIdsByOffices,
  getEmployees,
  getOfficesIdsByEmployee,
  getOfficesIdsByEmployeeHead,
  OfficesIdsByEmployeeResponse,
  PaginatedResponse
} from './employees_service';
import { getMySchedule, getOfficesTimetable, getSchedule } from './shedule_service';
import { OfficeTimetableDto } from '@/dto/DtoOffice';
import { EmployeeSchedule, myScheduleResponse } from '@/dto/DtoSchedule';
import { baseLayoutStore } from '@/stores/baseLayout.store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false
    }
  }
});

export const employeeEntityKey = (userId: number) => ['employeeEntity', userId] as const;
export const officesKey = (employeeId: number) => ['offices', employeeId] as const;
export const employeeIdsByOfficeKey = (officeId: number) => ['employeeIdsByOffice', officeId] as const;
export const employeesByIdsKey = (employeeIds: number[], page: number, size: number) =>
  ['employeesByIds', employeeIds, page, size] as const;
export const employeesByCityKey = (cityId: number) => ['employeesByCity', cityId] as const;
export const officeTimetableKey = (officeId: number) => ['officeTimetable', officeId] as const;
export const scheduleKey = (officeId: number, year: number, month: number) =>
  ['schedule', officeId, year, month] as const;
export const myScheduleKey = (employeeId: number, year: number, month: number) =>
  ['mySchedule', employeeId, year, month] as const;

export const fetchEmployeeEntity = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, userId] = queryKey as ReturnType<typeof employeeEntityKey>;
    const res = await getEmployeeEntity(userId);
    return res.data as EmployeeEntityResponse;
  } catch (error) {
    baseLayoutStore.showWarning('Ошибка загрузки данных');
    throw error;
  }
};

export const fetchOffices = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, employeeId] = queryKey as ReturnType<typeof officesKey>;
    const res = await (isUserAdmin() ? getOfficesIdsByEmployeeHead(employeeId) : getOfficesIdsByEmployee(employeeId));
    return Array.isArray(res.data)
      ? (res.data as OfficesIdsByEmployeeResponse[])
      : [res.data as OfficesIdsByEmployeeResponse];
  } catch (error) {
    baseLayoutStore.showWarning('Ошибка загрузки данных');
    throw error;
  }
};

export const fetchEmployeeIdsByOffice = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, officeId] = queryKey as ReturnType<typeof employeeIdsByOfficeKey>;
    const res = await getEmployeeIdsByOffices(officeId);
    return res.data as number[];
  } catch (error) {
    baseLayoutStore.showWarning('Ошибка загрузки данных');
    throw error;
  }
};

export const fetchEmployeesByIds = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, employeeIds, page, size] = queryKey as ReturnType<typeof employeesByIdsKey>;
    const res = await getEmployees({ id: employeeIds, page, size });
    return res.data as PaginatedResponse<EmployeeResponse[]>;
  } catch (error) {
    baseLayoutStore.showWarning('Не удалось получить данные сотрудников');
    throw error;
  }
};

export const fetchEmployeesByCity = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, cityId] = queryKey as ReturnType<typeof employeesByCityKey>;
    const res = await getEmployees({ cityId: cityId });
    return res.data as PaginatedResponse<EmployeeResponse[]>;
  } catch (error) {
    baseLayoutStore.showWarning('Не удалось получить данные сотрудников');
    throw error;
  }
};

export const fetchOfficeTimetable = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, officeId] = queryKey as ReturnType<typeof officeTimetableKey>;
    const res = await getOfficesTimetable(officeId);
    return res.data as OfficeTimetableDto;
  } catch (error) {
    baseLayoutStore.showWarning('Не удалось получить расписание офиса');
    throw error;
  }
};

export const fetchSchedule = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, officeId, year, month] = queryKey as ReturnType<typeof scheduleKey>;
    const res = await getSchedule(officeId, year, month + 1);
    return res.data.data as Record<string, EmployeeSchedule[]>;
  } catch (error) {
    baseLayoutStore.showWarning('Не удалось получить расписание');
    throw error;
  }
};

export const fetchMySchedule = async ({ queryKey }: QueryFunctionContext) => {
  try {
    const [, employeeId, year, month] = queryKey as ReturnType<typeof myScheduleKey>;
    const res = await getMySchedule(employeeId, year, month + 1);
    return res.data as myScheduleResponse;
  } catch (error) {
    baseLayoutStore.showWarning('Не удалось получить ваше расписание');
    throw error;
  }
};

import { AxiosResponse } from 'axios';

import { scheduleInstance } from './config';

export interface Shift {
  id: number;
  officeId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Absence {
  id: number;
  absenceTypeId: number;
  code: string;
  name: string;
  date: string;
}

export interface EmployeeSchedule {
  fullName: string;
  shifts: Shift[];
  absences: Absence[];
}

export interface MyShift extends Shift {
  officeName: string;
}

export interface MyAbsence extends Pick<Absence, 'id' | 'absenceTypeId' | 'date'> {
  type: 'SICK_LEAVE' | 'VACATION' | 'DAY_OFF';
}

export interface ScheduleMyResponse {
  shifts: MyShift[];
  absences: MyAbsence[];
}

export type EmployeesById = Record<string, EmployeeSchedule>;

export type ScheduleResponse = Record<string, EmployeesById>;

export type CreateShiftDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type CreateAbsenceDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick';
};

export const getSchedule = (
  year: number,
  month: number,
  officeId: number
): Promise<AxiosResponse<ScheduleResponse>> => {
  return scheduleInstance.get('/schedule', {
    params: {
      year,
      month,
      officeId
    }
  });
};

export const getScheduleMy = (year: number, month: number): Promise<AxiosResponse<ScheduleMyResponse>> => {
  return scheduleInstance.get('/schedule/my', {
    params: {
      year,
      month
    }
  });
};

export const createShift = (dto: CreateShiftDto): Promise<AxiosResponse<Shift>> => {
  return scheduleInstance.post('/shifts', dto);
};

export const deleteShift = (shiftId: number): Promise<AxiosResponse<void>> => {
  return scheduleInstance.delete(`/shifts/${shiftId}`);
};

export const createAbsence = (dto: CreateAbsenceDto): Promise<AxiosResponse<Absence>> => {
  return scheduleInstance.post('/absences', dto);
};

export const deleteAbsence = (absenceId: number): Promise<AxiosResponse<void>> => {
  return scheduleInstance.delete(`/absences/${absenceId}`);
};

export interface OfficeDto {
  id: number;
  code: string;
  name: string;
  address: string;
  cityId: number;
}

export interface OfficesResponse {
  content: OfficeDto[];
}

export const getOffices = (): Promise<AxiosResponse<OfficesResponse>> =>
  scheduleInstance.get<OfficesResponse>('/offices/my');

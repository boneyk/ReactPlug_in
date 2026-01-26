import { AxiosResponse } from 'axios';
import { OfficesResponse } from 'dto/DtoEmployeesService';
import { Absence, CreateAbsenceDto, CreateShiftDto, EmployeeSchedule } from 'dto/DtoScheduleService';

import { Shift } from 'utils/functions';

import { instance } from './config';

export type EmployeesById = Record<string, EmployeeSchedule>;

export type ScheduleResponse = {
  [role: string]: EmployeeSchedule[];
};

export interface GetScheduleApiResponse {
  data: ScheduleResponse;
}


export const getSchedule = (
  officeId: number,
  year: number,
  month: number
): Promise<AxiosResponse<GetScheduleApiResponse>> => {
  return instance.get(`/schedule/schedules/${officeId}`, {
    params: {
      year,
      month
    }
  });
};

export const createShift = (dto: CreateShiftDto): Promise<AxiosResponse<Shift>> => {
  return instance.post('/schedule/shifts', dto);
};

export const deleteShift = (shiftId: number): Promise<AxiosResponse<void>> => {
  return instance.delete(`/schedule/shifts/${shiftId}`);
};

export const createAbsence = (dto: CreateAbsenceDto): Promise<AxiosResponse<Absence>> => {
  return instance.post('/schedule/absences', dto);
};

export const deleteAbsence = (absenceId: number): Promise<AxiosResponse<void>> => {
  return instance.delete(`/schedule/absences/${absenceId}`);
};

export const getOffices = (): Promise<AxiosResponse<OfficesResponse>> =>
  instance.get<OfficesResponse>('/office/offices/my');

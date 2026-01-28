import { AxiosResponse } from 'axios';

import { instance } from './config';
import type {
  Absence,
  ApiShift,
  CreateAbsenceDto,
  CreateShiftDto,
  OfficesResponse,
  ScheduleMyResponse,
  ScheduleResponse
} from '@/dto/DtoSchedule';

export const getSchedule = (
  officeId: number,
  year: number,
  month: number
): Promise<AxiosResponse<ScheduleResponse>> => {
  return instance.get(`/schedules/${officeId}`, {
    params: {
      year,
      month
    }
  });
};

export const getMySchedule = (year: number, month: number): Promise<AxiosResponse<ScheduleMyResponse>> => {
  return instance.get('/schedules/my', {
    params: {
      year,
      month
    }
  });
};

export const createShift = (dto: CreateShiftDto): Promise<AxiosResponse<ApiShift>> => {
  return instance.post('/shifts', dto);
};

export const deleteShift = (shiftId: number): Promise<AxiosResponse<void>> => {
  return instance.delete(`/shifts/${shiftId}`);
};

export const createAbsence = (dto: CreateAbsenceDto): Promise<AxiosResponse<Absence>> => {
  return instance.post('/absences', dto);
};

export const deleteAbsence = (absenceId: number): Promise<AxiosResponse<void>> => {
  return instance.delete(`/absences/${absenceId}`);
};

export const getOffices = (): Promise<AxiosResponse<OfficesResponse>> => instance.get<OfficesResponse>('/offices/my');

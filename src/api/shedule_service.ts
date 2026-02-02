import { AxiosResponse } from 'axios';

import { instance } from './config';
import { OfficesResponse } from '@/dto/DtoOffice';
import type { ApiShift, CreateShiftDto, ScheduleMyResponse, ScheduleResponse } from '@/dto/DtoSchedule';

export const getSchedule = (
  officeId: number,
  year: number,
  month: number
): Promise<AxiosResponse<ScheduleResponse>> => {
  return instance.get(`schedule/schedules/by-office/${officeId}`, {
    params: {
      year,
      month
    }
  });
};

export const getMySchedule = (
  employeeId: number,
  year: number,
  month: number
): Promise<AxiosResponse<ScheduleMyResponse>> => {
  return instance.get(`api/schedule/schedules/by-employee/${employeeId}`, {
    params: {
      year,
      month
    }
  });
};

export const createShift = (dto: CreateShiftDto): Promise<AxiosResponse<ApiShift>> => {
  return instance.post('api/schedule/shifts', dto);
};

export const deleteShift = (shiftId: number): Promise<AxiosResponse<void>> => {
  return instance.delete(`api/schedule/shifts/${shiftId}`);
};

export const editShift = (): Promise<AxiosResponse<void>> => instance.put('api/schedule/'); // todo: Добавить подключение ручки, когда бэк ее сделает ORNG-50

export const getOffices = (): Promise<AxiosResponse<OfficesResponse>> =>
  instance.get<OfficesResponse>('api/office/offices/my');

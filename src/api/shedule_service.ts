import { AxiosResponse } from 'axios';

import { instance } from './config';
import { OfficesResponse } from '@/dto/DtoOffice';
import type {
  ApiShift,
  CreateShiftDto,
  editShiftRequest,
  myScheduleResponse,
  ScheduleResponse
} from '@/dto/DtoSchedule';

export const getSchedule = (
  officeId: number,
  year: number,
  month: number
): Promise<AxiosResponse<ScheduleResponse>> => {
  return instance.get(`api/schedule/schedules/by-office/${officeId}`, {
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
): Promise<AxiosResponse<myScheduleResponse>> => {
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

export const editShift = (shiftId: number, dto: editShiftRequest): Promise<AxiosResponse<void>> =>
  instance.put(`api/schedule/shifts/${shiftId}`, dto);

export const getOffices = (): Promise<AxiosResponse<OfficesResponse>> =>
  instance.get<OfficesResponse>('api/office/offices/my');

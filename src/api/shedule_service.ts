import { AxiosResponse } from 'axios';

import { CreateShiftDto } from '../dto/DtoScheduleService';

import { scheduleInstance } from './config';

export interface ShiftRequest {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: string;
}

export const getShifts = (year: number, month: number): Promise<AxiosResponse<ShiftRequest[]>> => {
  return scheduleInstance.get('/shifts', {
    params: {
      year,
      month
    }
  });
};

export const createShift = (dto: CreateShiftDto): Promise<AxiosResponse<ShiftRequest>> => {
  return scheduleInstance.post('/shifts', dto);
};

export const deleteShift = (shiftId: number): Promise<AxiosResponse<void>> => {
  return scheduleInstance.delete(`/shifts/${shiftId}`);
};

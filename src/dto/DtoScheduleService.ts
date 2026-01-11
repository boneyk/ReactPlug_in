export interface ShiftPresetDto {
  id: number;
  startTime: string;
  endTime: string;
}

export type CreateShiftDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'work' | 'vacation' | 'sick';
};

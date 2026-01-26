export interface ShiftPresetDto {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Shift {
  id: number;
  officeId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Absence {
  id: number;
  typeCode: 'vacation' | 'sick';
  typeName: string;
  date: string;
}

export interface EmployeeSchedule {
  employeeId: number;
  fullName: string;
  phone: string;
  email: string;
  shifts: Shift[];
  absences: Absence[];
}

export type CreateShiftDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'work';
};

export type CreateAbsenceDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick';
};

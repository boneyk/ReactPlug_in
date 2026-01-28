// Request DTOs
export interface CreateShiftDto {
  employeeId: number;
  officeId: number;
  startDate: string;
  endDate: string;
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

export interface EmployeeSchedule {
  employeeId: number;
  fullName: string;
  phone: string;
  email: string;
  shifts: Shift[];
  absences: Absence[];
}

// Response DTOs
export interface ApiShift {
  id: number;
  officeId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Absence {
  id: number;
  typeCode: string;
  typeName: string;
  date: string;
}

export interface EmployeeSchedule {
  employeeId: number;
  fullName: string;
  phone: string;
  email: string;
  shifts: ApiShift[];
  absences: Absence[];
}

export interface MyShift extends ApiShift {
  officeName: string;
}

export interface MyAbsence {
  id: number;
  typeCode: string;
  typeName: string;
  date: string;
}

export interface ScheduleMyResponse {
  employeeId: number;
  fullName: string;
  phone: string;
  email: string;
  shifts: MyShift[];
  absences: MyAbsence[];
}

export type EmployeesById = Record<string, EmployeeSchedule>;

export interface ScheduleResponse {
  data: Record<string, EmployeesById>;
}

export interface AbsenceType {
  id: number;
  code: string;
  name: string;
}

export interface OfficeDto {
  id: number;
  code: string;
  name: string;
  address: string;
  cityId: number;
}

export interface OfficesResponse {
  offices: OfficeDto[];
}

export type CreateAbsenceDto = {
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick';
};

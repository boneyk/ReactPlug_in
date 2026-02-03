// getSchedule Response
export interface ScheduleResponse {
  data: Record<string, EmployeeSchedule[]>;
}

export interface EmployeeSchedule {
  employeeId: number;
  fullName: string;
  phone: string;
  shifts: Shift[];
  absences: Absence[];
}

export interface Shift {
  id: number;
  officeId: number;
  employeeId: number;
  scheduledOn: string;
  startAt: string;
  endAt: string;
}

export interface Absence {
  id: number;
  employeeId: number;
  absentOn: string;
  absenceType: AbsenceType;
}

export interface AbsenceType {
  id: number;
  code: string;
  name: string;
}

export interface ApiShift {
  id: number;
  officeId: number;
  date: string;
  startTime: string;
  endTime: string;
}

// createShift Response
export interface CreateShiftDto {
  employeeId: number;
  officeId: number;
  startOn: string;
  endOn: string;
  startAt: string;
  endAt: string;
}

// getMySchedule
export interface myScheduleResponse {
  employeeId: number;
  fullName: string;
  phone: string;
  shifts: Shift[];
  absences: MyAbsence[];
}

export interface MyAbsence {
  id: number;
  typeCode: string;
  typeName: string;
  date: string;
}

// editShift
export interface editShiftRequest {
  startAt: string;
  endAt: string;
}

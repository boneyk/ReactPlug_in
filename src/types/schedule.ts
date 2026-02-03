export type ShiftType = 'work' | 'vacation' | 'sick';

export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  type: ShiftType;
  label?: string;
}

export interface myScheduleItem {
  officeName: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface CalendarCell {
  day: number;
  month: number;
  myShifts: myScheduleItem[];
}

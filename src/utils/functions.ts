import { shiftTypeMap } from '../constants/timetable';

import type { Absence, Shift as ApiShift, EmployeeSchedule, ScheduleMyResponse } from '../api/shedule_service';
import { ShiftType } from '../stores/timetable.store';

export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  type: ShiftType;
  label?: string;
}

export function getMonthDaysCount(year: number, month: number): number {
  const nextMonthStartDate = new Date(year, month + 1, 1);
  nextMonthStartDate.setDate(nextMonthStartDate.getDate() - 1);
  return nextMonthStartDate.getDate();
}

const weekdays = new Map<number, string>();
weekdays.set(0, 'Воскр');
weekdays.set(1, 'Понед');
weekdays.set(2, 'Вторник');
weekdays.set(3, 'Среда');
weekdays.set(4, 'Четверг');
weekdays.set(5, 'Пятница');
weekdays.set(6, 'Суббота');

export function getWeekdayByDate(year: number, month: number, day: number): string {
  return weekdays.get(new Date(year, month, day).getDay()) ?? 'Unknown';
}

export function isShiftSameType(shift1: Shift, shift2: Shift): boolean {
  return shift1.startTime === shift2?.startTime && shift1?.endTime === shift2?.endTime && shift1?.type === shift2?.type;
}

export function getDayFromShiftDay(shiftDate: string): number {
  return Number(shiftDate.slice(-2));
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function transformEmployeeShifts(employeeData: EmployeeSchedule): Shift[] {
  return [
    ...employeeData.shifts.map((shift: ApiShift) => ({
      id: shift.id,
      startTime: shift.startTime,
      endTime: shift.endTime,
      date: shift.date,
      type: 'work' as const
    })),
    ...employeeData.absences.map((absence: Absence) => {
      const type = absence.code.toLowerCase() === 'sick' ? 'sick' : 'vacation';
      return {
        id: absence.id,
        startTime: '00:00',
        endTime: '00:00',
        date: absence.date,
        type: type as 'sick' | 'vacation',
        label: absence.name
      };
    })
  ];
}

export function buildShiftsWorkerList(daysInMonth: number, employeeData: EmployeeSchedule) {
  const workerShifts = transformEmployeeShifts(employeeData);

  const daysArray: string[] = Array.from({ length: daysInMonth + 2 }, () => '');
  let curShiftSectionNumber = 0;
  let prevShift: Shift = {
    id: -1,
    startTime: '',
    endTime: '',
    date: '',
    type: 'work'
  };

  const sortedShifts = JSON.parse(JSON.stringify(workerShifts));
  sortedShifts.sort((a: Shift, b: Shift) => a.date.localeCompare(b.date));

  sortedShifts.forEach((shift: Shift) => {
    const day = getDayFromShiftDay(shift.date);
    if (!isShiftSameType(prevShift, shift)) {
      curShiftSectionNumber++;
    } else if (day - getDayFromShiftDay(prevShift.date) !== 1) {
      curShiftSectionNumber++;
    }
    daysArray[day] = `${shift.type.padEnd(8, ' ')}-shift${curShiftSectionNumber}|`;
    if (shift.type === 'work') {
      daysArray[day] += `${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
    } else {
      daysArray[day] += shiftTypeMap.get(shift.type);
    }
    prevShift = shift;
  });

  return daysArray;
}

export function isStart(daysShiftsList: string[], index: number): boolean {
  return daysShiftsList[index] !== daysShiftsList[index + 1] && daysShiftsList[index + 1] === daysShiftsList[index + 2];
}

export function isEnd(daysShiftsList: string[], index: number): boolean {
  return daysShiftsList[index] === daysShiftsList[index + 1] && daysShiftsList[index + 1] !== daysShiftsList[index + 2];
}

export function isMid(daysShiftsList: string[], index: number): boolean {
  return daysShiftsList[index] === daysShiftsList[index + 1] && daysShiftsList[index + 1] === daysShiftsList[index + 2];
}

export function isSolo(daysShiftsList: string[], index: number): boolean {
  return daysShiftsList[index] !== daysShiftsList[index + 1] && daysShiftsList[index + 1] !== daysShiftsList[index + 2];
}

export function getShiftType(arrayString: string): string {
  return arrayString.slice(0, 8).trim().toLowerCase();
}

export function getShiftTitle(daysShiftsList: string[], index: number): string {
  return daysShiftsList[index + 1].split('|')[1];
}

export function getCalendarMatrix(year: number, monthIndex: number): string[][] {
  const calendarMatrix: string[][] = [];
  const calendarPointer = new Date(year, monthIndex, 1);
  calendarPointer.setDate(calendarPointer.getDate() - calendarPointer.getDay());

  calendarMatrix.push(Array(7));
  for (let i = 0; i < 7; i++) {
    calendarMatrix[0][i] = `${calendarPointer.getDate()}|${calendarPointer.getMonth()}`;
    calendarPointer.setDate(calendarPointer.getDate() + 1);
  }

  let rowNumber = 1;
  while (calendarPointer.getMonth() === monthIndex) {
    calendarMatrix.push(Array(7));
    for (let i = 0; i < 7; i++) {
      calendarMatrix[rowNumber][i] = `${calendarPointer.getDate()}|${calendarPointer.getMonth()}`;
      calendarPointer.setDate(calendarPointer.getDate() + 1);
    }
    rowNumber++;
  }

  return calendarMatrix;
}

export interface ScheduleMyItem {
  officeName: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface CalendarCell {
  day: number;
  month: number;
  myShifts: ScheduleMyItem[];
}

export function getScheduleMyMatrix(data: ScheduleMyResponse, calendarMatrix: string[][]): CalendarCell[][] {
  const shiftsByDate = new Map<string, ScheduleMyItem[]>();

  data.shifts.forEach((shift) => {
    const dateParts = shift.date.split('-');
    const day = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const key = `${day}|${month}`;
    const items = shiftsByDate.get(key) || [];
    items.push({
      officeName: shift.officeName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: 'work'
    });
    shiftsByDate.set(key, items);
  });

  data.absences.forEach((absence) => {
    const dateParts = absence.date.split('-');
    const day = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const key = `${day}|${month}`;
    const items = shiftsByDate.get(key) || [];
    items.push({
      officeName: '',
      startTime: '',
      endTime: '',
      type: absence.type
    });
    shiftsByDate.set(key, items);
  });

  return calendarMatrix.map((week) =>
    week.map((cell) => {
      const [day, month] = cell.split('|').map(Number);
      return {
        day,
        month,
        myShifts: shiftsByDate.get(cell) || []
      };
    })
  );
}

import { shiftTypeMap } from '@/constants/timetable';

import type { Absence, EmployeeSchedule, ScheduleMyResponse } from '@/dto/DtoSchedule';
import type { CalendarCell, ScheduleMyItem, Shift, ShiftType } from '@/types/schedule';

export function transformEmployeeShifts(employeeData: EmployeeSchedule): Shift[] {
  return [
    ...employeeData.shifts.map((shift) => ({
      id: shift.id,
      startTime: shift.startAt,
      endTime: shift.endAt,
      date: shift.scheduledOn,
      type: 'work' as const
    })),
    ...employeeData.absences.map((absence: Absence) => {
      const type = normalizeAbsenceType(absence.absenceType.code);
      return {
        id: absence.id,
        startTime: '00:00',
        endTime: '00:00',
        date: absence.absentOn,
        type,
        label: absence.absenceType.name
      };
    })
  ];
}

export function normalizeAbsenceType(typeCode: string): ShiftType {
  const code = typeCode.toLowerCase();
  if (code === 'sick') return 'sick';
  if (code === 'vacation') return 'vacation';
  return 'vacation';
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

export function buildShiftsWorkerList(
  year: number,
  month: number,
  daysInMonth: number,
  employeeData: EmployeeSchedule
) {
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

  const sortedShifts = [...workerShifts].sort((a, b) => a.date.localeCompare(b.date));

  let leftPointer = 0;
  let rightPointer = 0;

  const formatDate = (day: number) => `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;

  const addDatesToBlock = () => {
    for (let i = leftPointer; i <= rightPointer; i++) {
      if (daysArray[i]) {
        daysArray[i] += `|${formatDate(leftPointer)}|${formatDate(rightPointer)}`;
      }
    }
  };

  sortedShifts.forEach((shift: Shift) => {
    const day = getDayFromShiftDay(shift.date);
    const isNewBlock =
      prevShift.id === -1 || !isShiftSameType(prevShift, shift) || day - getDayFromShiftDay(prevShift.date) !== 1;

    if (isNewBlock) {
      if (prevShift.id !== -1) {
        addDatesToBlock();
      }
      curShiftSectionNumber++;
      leftPointer = day;
    }
    rightPointer = day;

    daysArray[day] = `${shift.type.padEnd(8, ' ')}-shift${curShiftSectionNumber}|`;
    if (shift.type === 'work') {
      daysArray[day] += `${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
    } else {
      daysArray[day] += shiftTypeMap.get(shift.type);
    }
    prevShift = shift;
  });

  if (sortedShifts.length > 0) {
    addDatesToBlock();
  }
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
  const dayOfWeek = calendarPointer.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  calendarPointer.setDate(calendarPointer.getDate() - mondayOffset);

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

export function getScheduleMyMatrix(
  data: ScheduleMyResponse,
  calendarMatrix: string[][],
  officeMap: Map<number, string>
): CalendarCell[][] {
  const shiftsByDate = new Map<string, ScheduleMyItem[]>();
  data.shifts.forEach((shift) => {
    const dateParts = shift.scheduledOn.split('-');
    const day = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const key = `${day}|${month}`;
    const items = shiftsByDate.get(key) || [];
    items.push({
      officeName: officeMap.get(shift.officeId) ?? 'Неизвестный офис',
      startTime: shift.startAt,
      endTime: shift.endAt,
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
      type: normalizeAbsenceType(absence.typeCode)
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

export function getMonthDaysCount(year: number, month: number): number {
  const nextMonthStartDate = new Date(year, month + 1, 1);
  nextMonthStartDate.setDate(nextMonthStartDate.getDate() - 1);
  return nextMonthStartDate.getDate();
}

const weekdays = new Map<number, string>([
  [0, 'Воскр'],
  [1, 'Понед'],
  [2, 'Вторник'],
  [3, 'Среда'],
  [4, 'Четверг'],
  [5, 'Пятница'],
  [6, 'Суббота']
]);

export function getWeekdayByDate(year: number, month: number, day: number): string {
  return weekdays.get(new Date(year, month, day).getDay()) ?? 'Unknown';
}

const shiftTypeLabels: Record<string, string> = {
  vacation: 'Отпуск',
  sick: 'Больничный'
};

const shiftTypeClasses: Record<string, string> = {
  work: 'work',
  vacation: 'vacation',
  sick: 'sick'
};

export const formatShiftLabel = (shift: ScheduleMyItem): string => {
  if (shift.type === 'work') {
    return `${shift.officeName}, ${formatTime(shift.startTime)}-${formatTime(shift.endTime)}`;
  }
  return shiftTypeLabels[shift.type] || shift.type;
};

export const getShiftClassName = (type: string): string => {
  return shiftTypeClasses[type] || 'work';
};

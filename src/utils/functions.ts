import { shiftTypeMap } from '../constants/timetable';

import type { Shift, ShiftType, Worker } from '../stores/timetable.store';

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

const clampShiftToMonth = (shift: Shift, year: number, month: number, daysInMonth: number) => {
  const monthStart = new Date(year, month, 1, 0, 0, 0);
  const monthEnd = new Date(year, month, daysInMonth, 0, 0, 0);

  const startDate = new Date(`${shift.startDate}T00:00:00`);
  const endDate = new Date(`${shift.endDate}T00:00:00`);

  const start = startDate < monthStart ? monthStart : startDate;
  const end = endDate > monthEnd ? monthEnd : endDate;

  if (end < start) return null;

  const startIdx = start.getDate() - 1;
  const endIdx = end.getDate() - 1;

  return { startIdx, endIdx };
};

export function getWeekdayByDate(year: number, month: number, day: number): string {
  return weekdays.get(new Date(year, month, day).getDay()) ?? 'Unknown';
}

export type ShiftBlock = {
  id: number;
  startIdx: number;
  spanDays: number;
  type: ShiftType;
  text: string;
};

export const buildWorkerBlocks = (worker: Worker, year: number, month: number, daysInMonth: number): ShiftBlock[] => {
  const shiftSegments: ShiftBlock[] = [];

  worker.shifts.forEach((shift: Shift) => {
    const clamped = clampShiftToMonth(shift, year, month, daysInMonth);
    if (!clamped) return;

    const spanDays = clamped.endIdx - clamped.startIdx + 1;

    shiftSegments.push({
      id: shift.id,
      startIdx: clamped.startIdx,
      spanDays,
      type: shift.type,
      text: shiftTypeMap.get(shift.type.toLowerCase()) ?? `${shift.startTime} - ${shift.endTime}`
    });
  });

  shiftSegments.sort((a, b) => b.spanDays - a.spanDays);

  return shiftSegments;
};

export function groupBlocksByStart(blocks: ShiftBlock[]) {
  const map = new Map<number, ShiftBlock[]>();

  for (const block of blocks) {
    const arr = map.get(block.startIdx);
    if (arr) arr.push(block);
    else map.set(block.startIdx, [block]);
  }

  return map;
}

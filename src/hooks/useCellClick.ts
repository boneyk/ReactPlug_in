import { useMemo } from 'react';

import dayjs from 'dayjs';
import { timetableStore } from 'stores/timetable.store';

import { daysToIndex } from '@/utils/dateTime';
import { Formats } from '@/utils/formats';

import { buildShiftsWorkerList, getShiftTitle, getShiftType } from '@/lib/schedule';
import { modalCreateStore } from '@/stores/modalCreate.store';
import { modalViewStore } from '@/stores/modalView.store';
import type { ShiftType } from '@/types/schedule';

interface UseWorkerRowModalParams {
  role: string;
  employeeId: number;
  days: number[];
  daysInMonth: number;
  year: number;
  month: number;
}

export const useCellClick = ({ role, employeeId, days, daysInMonth, year, month }: UseWorkerRowModalParams) => {
  const workerData = timetableStore.shifts[role]?.[employeeId];
  const daysShiftsList = useMemo(() => {
    return buildShiftsWorkerList(timetableStore.year, timetableStore.month, daysInMonth, workerData);
  }, [daysInMonth, workerData]);
  const getCellDate = (dayIndex: number) => dayjs(new Date(year, month, days[dayIndex] + 1));
  const isPastDate = (dayIndex: number) => getCellDate(dayIndex).isBefore(dayjs(), 'day');
  const hasShift = (dayIndex: number) => Boolean(daysShiftsList[dayIndex + 1]);
  const getDaysToIndex = (dayIndex: number) => daysToIndex[getCellDate(dayIndex).day()];
  const canAddShift = (dayIndex: number) =>
    !hasShift(dayIndex) && !isPastDate(dayIndex) && isOfficeWorkingDay(dayIndex);

  const isOfficeWorkingDay = (dayIndex: number) => {
    const officeTimetable = timetableStore.officeTimetable;
    if (!officeTimetable || !officeTimetable.workingHours) return false;
    const backendDay = getDaysToIndex(dayIndex);
    return officeTimetable.workingHours.find((wh) => wh.dayOfWeek === backendDay);
  };

  const getShiftByDayIndex = (dayIndex: number) => {
    const date = getCellDate(dayIndex).format(Formats.DATE);
    const shift = workerData.shifts.find((shift) => shift.scheduledOn === date);
    if (shift) return shift;
    return workerData.absences?.find((absence) => absence.absentOn === date);
  };

  const openViewModalForShift = (dayIndex: number) => {
    const shift = getShiftByDayIndex(dayIndex);
    if (!shift) return;
    const value = daysShiftsList[dayIndex + 1];
    const parts = value.split('|');
    const startDate = parts[2] || '';
    const endDate = parts[3] || '';

    modalViewStore.open({
      id: shift.id,
      employeeId: workerData.employeeId,
      fullname: workerData.fullName,
      job: role,
      dayIndex,
      type: getShiftType(value) as ShiftType,
      text: getShiftTitle(daysShiftsList, dayIndex),
      startDate,
      endDate
    });
  };

  const openCreateModal = (dayIndex: number) => {
    timetableStore.initRoleAndEmployee(role, {
      id: workerData.employeeId,
      name: workerData.fullName
    });

    const cellDate = getCellDate(dayIndex);
    modalCreateStore.setStartDate(cellDate);
    modalCreateStore.setEndDate(cellDate);
    modalCreateStore.selectPreset(1);
    modalCreateStore.open(false);
  };

  const handleCellClick = (dayIndex: number) => {
    if (hasShift(dayIndex)) {
      openViewModalForShift(dayIndex);
      return;
    }
    if (isPastDate(dayIndex) || !isOfficeWorkingDay(dayIndex)) return;
    openCreateModal(dayIndex);
  };

  return {
    daysShiftsList,
    handleCellClick,
    canAddShift,
    isOfficeWorkingDay
  };
};

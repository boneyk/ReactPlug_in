import { useMemo, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { timetableStore } from 'stores/timetable.store';

import { Formats } from '@/utils/formats';

import { useViewModal } from './useViewModal';
import { buildShiftsWorkerList, getShiftTitle, getShiftType } from '@/lib/schedule';
import type { ShiftType } from '@/types/schedule';

interface CreateModalData {
  open: boolean;
  startDate: Dayjs | null;
}

interface UseWorkerRowModalParams {
  role: string;
  employeeId: number;
  days: number[];
  daysInMonth: number;
  year: number;
  month: number;
}

export const useCellClick = ({ role, employeeId, days, daysInMonth, year, month }: UseWorkerRowModalParams) => {
  const { isOpen, selectedShift, openViewModal, closeModal } = useViewModal();
  const [createModalData, setCreateModalData] = useState<CreateModalData>({
    open: false,
    startDate: null
  });

  const workerData = timetableStore.shifts[role]?.[employeeId];
  const daysShiftsList = useMemo(() => {
    return buildShiftsWorkerList(timetableStore.year, timetableStore.month, daysInMonth, workerData);
  }, [daysInMonth, workerData]);
  const getCellDate = (dayIndex: number) => dayjs(new Date(year, month, days[dayIndex] + 1));
  const isPastDate = (dayIndex: number) => getCellDate(dayIndex).isBefore(dayjs(), 'day');
  const isSunday = (dayIndex: number) => getCellDate(dayIndex).day() === 0;
  const hasShift = (dayIndex: number) => Boolean(daysShiftsList[dayIndex + 1]);
  const canAddShift = (dayIndex: number) => !hasShift(dayIndex) && !isPastDate(dayIndex) && !isSunday(dayIndex);

  const getShiftByDayIndex = (dayIndex: number) => {
    const date = getCellDate(dayIndex).format(Formats.DATE);
    return workerData.shifts.find((shift) => shift.date === date);
  };

  const openViewModalForShift = (dayIndex: number) => {
    const shift = getShiftByDayIndex(dayIndex);
    if (!shift) return;
    const value = daysShiftsList[dayIndex + 1];
    const parts = value.split('|');
    const startDate = parts[2] || '';
    const endDate = parts[3] || '';

    openViewModal({
      id: shift.id,
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
    setCreateModalData({
      open: true,
      startDate: getCellDate(dayIndex)
    });
  };

  const handleCellClick = (dayIndex: number) => {
    if (hasShift(dayIndex)) {
      openViewModalForShift(dayIndex);
      return;
    }
    if (isPastDate(dayIndex) || isSunday(dayIndex)) return;
    openCreateModal(dayIndex);
  };
  const closeCreateModal = () => setCreateModalData((prev) => ({ ...prev, open: false }));

  return {
    daysShiftsList,
    createModalData,
    handleCellClick,
    closeCreateModal,
    isViewModalOpen: isOpen,
    selectedShift,
    closeViewModal: closeModal,
    canAddShift
  };
};

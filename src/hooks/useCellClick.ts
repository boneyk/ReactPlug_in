import { useMemo, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { ShiftType, timetableStore } from 'stores/timetable.store';

import { useViewModal } from 'components/Modals/ModalView/useViewModal';

import { buildShiftsWorkerList, getShiftTitle, getShiftType } from '../utils/functions';
import { EmployeeSchedule } from 'dto/DtoScheduleService';


interface CreateModalData {
  open: boolean;
  startDate: Dayjs | null;
}

interface UseWorkerRowModalParams {
  workerId: string;
  workerData: EmployeeSchedule;
  role: string;
  days: number[];
  daysInMonth: number;
  year: number;
  month: number;
}

export const useCellClick = ({
  workerId,
  workerData,
  role,
  days,
  daysInMonth,
  year,
  month
}: UseWorkerRowModalParams) => {
  const { isOpen, selectedShift, openShiftModal, closeModal } = useViewModal();
  const [createModalData, setCreateModalData] = useState<CreateModalData>({
    open: false,
    startDate: null
  });

  const daysShiftsList = useMemo(() => {
    return buildShiftsWorkerList(daysInMonth, workerData);
  }, [daysInMonth, workerData]);

  const getCellDate = (dayIndex: number) => dayjs(new Date(year, month, days[dayIndex] + 1));
  const isPastDate = (dayIndex: number) => getCellDate(dayIndex).isBefore(dayjs(), 'day');
  const isSunday = (dayIndex: number) => getCellDate(dayIndex).day() === 0;
  const hasShift = (dayIndex: number) => Boolean(daysShiftsList[dayIndex + 1]);
  const canAddShift = (dayIndex: number) => !hasShift(dayIndex) && !isPastDate(dayIndex) && !isSunday(dayIndex);
  const getSpanDays = (dayIndex: number, value: string) =>
    daysShiftsList.slice(dayIndex).reduce((count, v) => (v === value ? count + 1 : count), 0);

  const openCreateModal = (dayIndex: number) => {
    const date = getCellDate(dayIndex);
    timetableStore.initRoleAndEmployee(role, { id: Number(workerId), name: workerData.fullName });
    setCreateModalData({
      open: true,
      startDate: date
    });
  };
  const openViewModalForShift = (dayIndex: number, shiftValue: string) => {
    const spanDays = getSpanDays(dayIndex, shiftValue);
    openShiftModal({
      id: Number(workerId),
      fullname: workerData.fullName,
      job: role,
      dayIndex,
      type: getShiftType(shiftValue) as ShiftType,
      text: getShiftTitle(daysShiftsList, dayIndex),
      spanDays
    });
  };

  const handleCellClick = (dayIndex: number) => {
    if (hasShift(dayIndex)) {
      openViewModalForShift(dayIndex, daysShiftsList[dayIndex + 1]);
      return;
    }
    if (isPastDate(dayIndex)) return;
    if (!hasShift(dayIndex) && isSunday(dayIndex)) {
      console.log('Нельзя создавать смену на воскресенье');
      return;
    }
    if (!hasShift(dayIndex)) {
      openCreateModal(dayIndex);
      return;
    }
  };
  const closeCreateModal = () => setCreateModalData((prev) => ({ ...prev, open: false }));

  return {
    daysShiftsList,
    createModalData,
    handleCellClick,
    closeCreateModal,
    isViewModalOpen: isOpen,
    selectedShift,
    openShiftModal,
    closeViewModal: closeModal,
    canAddShift
  };
};

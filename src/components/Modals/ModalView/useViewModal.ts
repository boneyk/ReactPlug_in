import { useCallback, useState } from 'react';

import { ShiftType } from 'stores/timetable.store';

export interface ShiftModalData {
  fullname: string;
  job: string;
  dayIndex: number;
  type: ShiftType;
  text: string;
  spanDays: number;
}

export const useViewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftModalData | null>(null);

  const openModal = useCallback((data: ShiftModalData) => {
    setSelectedShift(data);
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openShiftModal = useCallback(
    (params: ShiftModalData) => {
      const { fullname, job, dayIndex, type, text, spanDays } = params;

      openModal({
        fullname,
        job,
        dayIndex,
        type,
        text,
        spanDays
      });
    },
    [openModal]
  );

  return {
    isOpen,
    selectedShift,
    openShiftModal,
    closeModal
  };
};

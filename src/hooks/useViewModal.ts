import { useCallback, useState } from 'react';

import type { ShiftType } from '@/types/schedule';

export interface ShiftModalData {
  id: number;
  fullname: string;
  job: string;
  dayIndex: number;
  type: ShiftType;
  text: string;
  startDate: string;
  endDate: string;
}

export const useViewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftModalData | null>(null);

  const openViewModal = useCallback((data: ShiftModalData) => {
    setSelectedShift(data);
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedShift(null);
  };

  return {
    isOpen,
    selectedShift,
    openViewModal,
    closeModal
  };
};

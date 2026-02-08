import type { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import type { ShiftModalData } from '@/hooks/useViewModal';

export class ModalDeleteStore {
  isOpen: boolean = false;
  shiftId: number | null = null;
  shiftData: ShiftModalData | null = null;
  startDate: Dayjs | null = null;
  endDate: Dayjs | null = null;
  deleteMode: 'single' | 'period' = 'single';

  constructor() {
    makeAutoObservable(this);
  }

  open = (
    shiftId: number,
    shiftData: ShiftModalData,
    startDate: Dayjs | null = null,
    endDate: Dayjs | null = null,
    deleteMode: 'single' | 'period' = 'single'
  ) => {
    this.shiftId = shiftId;
    this.shiftData = shiftData;
    this.startDate = startDate;
    this.endDate = endDate;
    this.deleteMode = deleteMode;
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
    this.shiftId = null;
    this.shiftData = null;
    this.startDate = null;
    this.endDate = null;
    this.deleteMode = 'single';
  };
}

export const modalDeleteStore = new ModalDeleteStore();

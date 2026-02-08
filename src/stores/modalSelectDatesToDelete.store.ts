import { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import type { ShiftModalData } from '@/hooks/useViewModal';

export class ModalSelectDatesToDeleteStore {
  isOpen: boolean = false;
  shiftData: ShiftModalData | null = null;
  deleteMode: 'single' | 'period' = 'single';
  startDate: Dayjs | null = null;
  endDate: Dayjs | null = null;
  shiftDates: Dayjs[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  open = (shiftData: ShiftModalData, shiftDates: Dayjs[]) => {
    this.shiftData = shiftData;
    this.shiftDates = shiftDates;
    this.deleteMode = 'single';
    this.startDate = shiftDates[0] || null;
    this.endDate = shiftDates[0] || null;
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
    this.shiftData = null;
    this.deleteMode = 'single';
    this.startDate = null;
    this.endDate = null;
    this.shiftDates = [];
  };

  setDeleteMode = (mode: 'single' | 'period') => {
    this.deleteMode = mode;
  };

  setStartDate = (date: Dayjs | null) => {
    this.startDate = date;
  };

  setEndDate = (date: Dayjs | null) => {
    this.endDate = date;
  };
}

export const modalSelectDatesToDeleteStore = new ModalSelectDatesToDeleteStore();

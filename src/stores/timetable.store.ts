import { scheduleInstance } from 'api/config';
import { makeAutoObservable, runInAction } from 'mobx';

export type ShiftType = 'work' | 'vacation' | 'sick';

export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  type: ShiftType;
  label?: string;
}

export interface Worker {
  fullName: string;
  shifts: Shift[];
}

export interface WorkersByRole {
  [id: string]: Worker;
}

export interface TimetableShifts {
  [role: string]: WorkersByRole;
}

export class TimetableStore {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  calendarTranslatePx: number = 0;
  calendarMaxTranslatePx: number = 0;
  daysInMonth: number = 0;
  days: number[] = [];
  selectedRole: string | null = null;
  selectedEmployee: { id: number; name: string } | null = null;
  shifts: TimetableShifts = {};
  loading = false;

  async loadShifts(year?: number, month?: number) {
    const y = year ?? this.year;
    const m = month ?? this.month + 1;
    try {
      const response = await scheduleInstance.get<{ data: TimetableShifts }>(`/shifts?year=${y}&month=${m}`);
      runInAction(() => {
        this.shifts = response.data.data;
      });
    } catch (error) {
      console.error('Ошибка при загрузке смен:', error);
    }
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCalendarMaxTranslatePx(max: number) {
    this.calendarMaxTranslatePx = Math.max(0, max);
    this.calendarTranslatePx = Math.min(this.calendarTranslatePx, this.calendarMaxTranslatePx);
  }

  resetCalendarTranslate() {
    this.calendarTranslatePx = 0;
  }

  moveCalendarLeft(stepPx: number) {
    this.calendarTranslatePx = Math.max(0, this.calendarTranslatePx - stepPx);
  }

  moveCalendarRight(stepPx: number) {
    this.calendarTranslatePx = Math.min(this.calendarMaxTranslatePx, this.calendarTranslatePx + stepPx);
  }

  incYear() {
    this.year += 1;
  }
  decYear() {
    this.year -= 1;
  }

  changeMonth(month: number) {
    this.month = month;
    this.resetCalendarTranslate();
  }

  changeDaysInMonth(day: number) {
    this.daysInMonth = day;
    this.changeDays();
  }

  changeDays() {
    this.days = Array.from({ length: this.daysInMonth }, (_, i) => i);
  }

  get roles(): string[] {
    return Object.keys(this.shifts);
  }

  getEmployeesByRole(role: string): { id: number; name: string }[] {
    const workersByRole = this.shifts[role];
    if (!workersByRole) return [];
    return Object.entries(workersByRole).map(([id, worker]) => ({
      id: Number(id),
      name: worker.fullName
    }));
  }
  get employeeId(): number | null {
    return timetableStore.selectedEmployee?.id ?? null;
  }
  setSelectedRole = (role: string | null) => {
    this.selectedRole = role;
    this.selectedEmployee = null;
  };
  setSelectedEmployee = (employee: { id: number; name: string } | null) => {
    this.selectedEmployee = employee;
  };
}

export const timetableStore = new TimetableStore();

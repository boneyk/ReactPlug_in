import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { handleNetworkError } from '@/utils/errorHandlers';

import { baseLayoutStore } from './baseLayout.store';
import { getMySchedule, getOffices, getSchedule } from '@/api/shedule_service';
import type { EmployeesById, OfficeDto } from '@/dto/DtoSchedule';
import { getCalendarMatrix, getMonthDaysCount, getScheduleMyMatrix } from '@/lib/schedule';
import type { CalendarCell } from '@/types/schedule';

export class TimetableStore {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  calendarTranslatePx: number = 0;
  calendarMaxTranslatePx: number = 0;
  daysInMonth: number = 0;
  days: number[] = [];
  todayIndex: number = 0;
  selectedRole: string | null = null;
  selectedEmployee: { id: number; name: string } | null = null;

  offices: OfficeDto[] = [];
  selectedOffice: OfficeDto | null = null;

  shifts: Record<string, EmployeesById> = {};
  myScheduleMatrix: CalendarCell[][] = [];
  isLoading: boolean = true;
  isMyScheduleLoading: boolean = false;

  scrollToEndAfterMonthChange: boolean = false;

  private readonly SELECTED_OFFICE_KEY = 'selectedOfficeId';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    void this.init();
  }

  async init() {
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    await this.fetchOffices();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async fetchOffices() {
    this.isLoading = true;
    try {
      const response = await getOffices();
      runInAction(() => {
        this.offices = response.data.offices;
        if (this.offices.length > 0) {
          const savedOfficeId = this.getSavedOfficeId();
          const savedOffice = savedOfficeId ? this.offices.find((office) => office.id === savedOfficeId) : null;
          this.selectedOffice = savedOffice || this.offices[0];
          this.isLoading = false;
        }
      });
    } catch (error: unknown) {
      let message = 'Ошибка при загрузке рабочего графика';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  async setSelectedOffice(office: OfficeDto) {
    this.selectedOffice = office;
    this.saveOfficeId(office.id);
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  setCalendarMaxTranslatePx(max: number) {
    this.calendarMaxTranslatePx = Math.max(0, max);
    if (this.scrollToEndAfterMonthChange) {
      this.calendarTranslatePx = this.calendarMaxTranslatePx;
      this.scrollToEndAfterMonthChange = false;
    } else {
      this.calendarTranslatePx = Math.min(this.calendarTranslatePx, this.calendarMaxTranslatePx);
    }
  }

  setCalendarTranslatePx(px: number) {
    this.calendarTranslatePx = Math.max(0, Math.min(px, this.calendarMaxTranslatePx));
  }

  resetCalendarTranslate() {
    this.calendarTranslatePx = 0;
  }

  moveCalendarLeft(stepPx: number) {
    const currentPx = Math.min(this.calendarTranslatePx, this.calendarMaxTranslatePx);
    if (currentPx <= 0) {
      this.goToPreviousMonth();
    } else {
      this.calendarTranslatePx = Math.max(0, currentPx - stepPx);
    }
  }

  moveCalendarRight(stepPx: number) {
    if (this.calendarTranslatePx >= this.calendarMaxTranslatePx) {
      this.goToNextMonth();
    } else {
      this.calendarTranslatePx = Math.min(this.calendarMaxTranslatePx, this.calendarTranslatePx + stepPx);
    }
  }

  changeTodayIndex() {
    const date = new Date();
    if (date.getFullYear() !== this.year || date.getMonth() !== this.month) this.todayIndex = -1;
    else this.todayIndex = date.getDate() - 1;
  }

  async incYear() {
    this.year += 1;
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async decYear() {
    this.year -= 1;
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async resetToCurrentDate() {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async changeMonth(month: number) {
    this.month = month;
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async goToPreviousMonth() {
    if (this.month > 0) {
      this.month -= 1;
    } else {
      this.year -= 1;
      this.month = 11;
    }
    this.scrollToEndAfterMonthChange = true;
    this.calendarTranslatePx = Number.MAX_SAFE_INTEGER;
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  async goToNextMonth() {
    if (this.month < 11) {
      this.month += 1;
    } else {
      this.year += 1;
      this.month = 0;
    }
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      await this.fetchSchedule(this.selectedOffice.id, this.year, this.month);
    }
  }

  changeDaysInMonth(day: number) {
    this.daysInMonth = day;
    this.changeDays();
  }

  changeDays() {
    this.days = Array.from({ length: this.daysInMonth }, (_, i) => i);
  }

  initRoleAndEmployee(role: string, employee: { id: number; name: string }) {
    this.selectedRole = role;
    this.selectedEmployee = employee;
  }

  resetRoleAndPerson() {
    this.selectedRole = null;
    this.selectedEmployee = null;
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
    return this.selectedEmployee?.id ?? null;
  }
  setSelectedRole(role: string | null) {
    this.selectedRole = role;
    this.selectedEmployee = null;
  }
  setSelectedEmployee(employee: { id: number; name: string } | null) {
    this.selectedEmployee = employee;
  }

  async fetchSchedule(officeId: number, year: number, month: number) {
    this.isLoading = true;
    try {
      const response = await getSchedule(officeId, year, month + 1);
      runInAction(() => {
        this.shifts = response.data.data;
        this.isLoading = false;
      });
    } catch (error: any) {
      baseLayoutStore.showWarning(error.response.data.detail);
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  async fetchMySchedule() {
    this.isMyScheduleLoading = true;
    try {
      const response = await getMySchedule(this.year, this.month + 1);
      const calendarMatrix = getCalendarMatrix(this.year, this.month);
      runInAction(() => {
        this.myScheduleMatrix = getScheduleMyMatrix(response.data, calendarMatrix);
        this.isMyScheduleLoading = false;
      });
    } catch (error) {
      const calendarMatrix = getCalendarMatrix(this.year, this.month);
      runInAction(() => {
        this.myScheduleMatrix = calendarMatrix.map((week) =>
          week.map((cell) => {
            const [day, month] = cell.split('|').map(Number);
            return { day, month, myShifts: [] };
          })
        );
        this.isMyScheduleLoading = false;
      });
      handleNetworkError(error);
    }
  }

  private saveOfficeId(officeId: number): void {
    try {
      localStorage.setItem(this.SELECTED_OFFICE_KEY, officeId.toString());
    } catch (error: unknown) {
      let message = 'Ошибка при загрузке офиса';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
    }
  }

  private getSavedOfficeId(): number | null {
    try {
      const savedId = localStorage.getItem(this.SELECTED_OFFICE_KEY);
      return savedId ? Number(savedId) : null;
    } catch (error: unknown) {
      let message = 'Ошибка при загрузке офиса';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
      return null;
    }
  }
  resetStore() {
    this.selectedOffice = null;
    this.selectedEmployee = null;
    this.selectedRole = null;
    this.shifts = {};
  }
}

export const timetableStore = new TimetableStore();

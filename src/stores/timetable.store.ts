import { makeAutoObservable, runInAction } from 'mobx';

import { handleNetworkError } from '../utils/errorHandlers';
import { getMonthDaysCount } from '../utils/functions';
import { CalendarCell, getCalendarMatrix, getScheduleMyMatrix } from '../utils/functions';

import { getOffices, getSchedule, getScheduleMy, OfficeDto, ScheduleResponse } from '../api/shedule_service';

export type ShiftType = 'work' | 'vacation' | 'sick';

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

  shifts: ScheduleResponse = {};
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
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  async fetchOffices() {
    this.isLoading = true;

    try {
      const response = await getOffices();
      runInAction(() => {
        this.offices = response.data.content;
        if (this.offices.length > 0) {
          const savedOfficeId = this.getSavedOfficeId();
          const savedOffice = savedOfficeId ? this.offices.find((office) => office.id === savedOfficeId) : null;
          this.selectedOffice = savedOffice || this.offices[0];
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Ошибка загрузки офисов:', error);
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  setSelectedOffice(office: OfficeDto) {
    this.selectedOffice = office;
    this.saveOfficeId(office.id);
    void this.fetchSchedule(this.year, this.month, office.id);
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

  incYear() {
    this.year += 1;
    this.changeTodayIndex();
    if (this.selectedOffice) {
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  decYear() {
    this.year -= 1;
    this.changeTodayIndex();
    if (this.selectedOffice) {
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  resetToCurrentDate() {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  changeMonth(month: number) {
    this.month = month;
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  goToPreviousMonth() {
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
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
    }
  }

  goToNextMonth() {
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
      void this.fetchSchedule(this.year, this.month, this.selectedOffice.id);
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

  async fetchSchedule(year: number, month: number, officeId: number) {
    this.isLoading = true;

    try {
      const response = await getSchedule(year, month + 1, officeId);
      runInAction(() => {
        this.shifts = response.data;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  async fetchScheduleMy() {
    this.isMyScheduleLoading = true;
    try {
      const response = await getScheduleMy(this.year, this.month + 1);
      const calendarMatrix = getCalendarMatrix(this.year, this.month);
      runInAction(() => {
        this.myScheduleMatrix = getScheduleMyMatrix(response.data, calendarMatrix);
        this.isMyScheduleLoading = false;
      });
    } catch (error) {
      console.error('Ошибка загрузки личного расписания:', error);
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
    } catch (error) {
      console.error('Ошибка сохранения офиса в localStorage:', error);
    }
  }

  private getSavedOfficeId(): number | null {
    try {
      const savedId = localStorage.getItem(this.SELECTED_OFFICE_KEY);
      return savedId ? Number(savedId) : null;
    } catch (error) {
      console.error('Ошибка чтения офиса из localStorage:', error);
      return null;
    }
  }
}

export const timetableStore = new TimetableStore();

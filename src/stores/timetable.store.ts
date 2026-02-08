import { makeAutoObservable } from 'mobx';

import { queryClient } from '@/api/queries';
import { scheduleKey } from '@/api/queries';
import { EmployeeEntityResponse } from '@/dto/DtoEmployeesService';
import type { OfficeDto, OfficeTimetableDto } from '@/dto/DtoOffice';
import type { EmployeeSchedule, myScheduleResponse } from '@/dto/DtoSchedule';
import { getCalendarMatrix, getMonthDaysCount, getmyScheduleMatrix } from '@/lib/schedule';
import type { CalendarCell } from '@/types/schedule';

export class TimetableStore {
  year = new Date().getFullYear();
  month = new Date().getMonth();

  calendarTranslatePx = 0;
  calendarMaxTranslatePx = 0;

  daysInMonth = 0;
  days: number[] = [];
  todayIndex = 0;

  selectedRole: string | null = null;
  selectedEmployee: { id: number; name: string } | null = null;
  selectedOffice: OfficeDto | null = null;
  shifts: Record<string, EmployeeSchedule[]> = {};
  myScheduleMatrix: CalendarCell[][] = [];
  offices: OfficeDto[] = [];
  scrollToEndAfterMonthChange = false;
  employee = {};
  officeTimetable: OfficeTimetableDto | null = null;
  private readonly SELECTED_OFFICE_KEY = 'selectedOfficeId';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
  }

  setOffices(offices: OfficeDto[]) {
    this.offices = offices;
  }

  setEmployee(employeeData: EmployeeEntityResponse) {
    this.employee = employeeData;
  }

  setMySchedule(data: myScheduleResponse) {
    const calendarMatrix = getCalendarMatrix(this.year, this.month);
    this.myScheduleMatrix = getmyScheduleMatrix(data, calendarMatrix, this.getOfficeMap());
  }

  setSelectedOffice(office: OfficeDto) {
    this.selectedOffice = office;
    this.saveOfficeId(office.id);
  }
  setOfficeTimetable(timeTable: OfficeTimetableDto) {
    this.officeTimetable = timeTable;
  }
  setCalendarTranslatePx(px: number) {
    this.calendarTranslatePx = Math.max(0, Math.min(px, this.calendarMaxTranslatePx));
  }

  changeMonth(month: number) {
    this.month = month;
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
    if (this.selectedOffice) {
      const data = queryClient.getQueryData<Record<string, EmployeeSchedule[]>>(
        scheduleKey(this.selectedOffice.id, this.year, this.month)
      );
      this.shifts = structuredClone(data ?? {});
    }
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
  incYear() {
    this.year += 1;
    this.changeTodayIndex();
  }

  decYear() {
    this.year -= 1;
    this.changeTodayIndex();
  }

  resetToCurrentDate() {
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.resetCalendarTranslate();
    this.changeDaysInMonth(getMonthDaysCount(this.year, this.month));
    this.changeTodayIndex();
  }

  changeTodayIndex() {
    const date = new Date();
    this.todayIndex = date.getFullYear() === this.year && date.getMonth() === this.month ? date.getDate() - 1 : -1;
  }

  changeDaysInMonth(days: number) {
    this.daysInMonth = days;
    this.days = Array.from({ length: days }, (_, i) => i);
  }

  setCalendarMaxTranslatePx(max: number) {
    this.calendarMaxTranslatePx = Math.max(0, max);
    this.calendarTranslatePx = Math.min(this.calendarTranslatePx, this.calendarMaxTranslatePx);
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
  }

  resetCalendarTranslate() {
    this.calendarTranslatePx = 0;
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

  getEmployeesByRole(role: string) {
    return (
      this.shifts[role]?.map((worker) => ({
        id: worker.employeeId,
        name: worker.fullName
      })) ?? []
    );
  }

  setSelectedRole(role: string | null) {
    this.selectedRole = role;
    this.selectedEmployee = null;
  }

  setSelectedEmployee(employee: { id: number; name: string } | null) {
    this.selectedEmployee = employee;
  }

  private saveOfficeId(officeId: number) {
    localStorage.setItem(this.SELECTED_OFFICE_KEY, officeId.toString());
  }

  getOfficeMap(): Map<number, string> {
    return new Map(this.offices.map((office) => [office.id, office.address]));
  }

  resetStore() {
    this.selectedOffice = null;
    this.selectedEmployee = null;
    this.selectedRole = null;
    this.officeTimetable = null;
    this.employee = {};
    this.myScheduleMatrix = [];
    this.offices = [];
    this.shifts = {};
    this.resetToCurrentDate();
  }
}

export const timetableStore = new TimetableStore();

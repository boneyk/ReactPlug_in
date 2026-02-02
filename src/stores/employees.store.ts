import { makeAutoObservable, runInAction } from 'mobx';

import { handleNetworkError } from '@/utils/errorHandlers';

import { timetableStore } from './timetable.store';
import {
  EmployeeResponse,
  getEmployeeEntity,
  getEmployeeIdsByOffices,
  getEmployees,
  getOfficesIdsByEmployee
} from '@/api/employees_service';

export type EmployeeStatus = 'ACTIVE' | 'FIRED';

const DEFAULT_PAGE_SIZE = 20;

export class EmployeesStore {
  employees: EmployeeResponse[] = [];
  isLoading: boolean = true;
  page: number = 0;
  pageSize: number = DEFAULT_PAGE_SIZE;
  totalElements: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    void this.init();
  }

  async fetchEmployees() {
    this.isLoading = true;

    try {
      const EmployeeEntityResponse = await getEmployeeEntity(Number(localStorage.getItem('user_id')));
      const OfficesIdsByEmployeeResponse = await getOfficesIdsByEmployee(EmployeeEntityResponse.data.id);
      const EmployeeIdsByOfficesResponse = await getEmployeeIdsByOffices(OfficesIdsByEmployeeResponse.data[0].id);
      if (!EmployeeIdsByOfficesResponse) {
        runInAction(() => {
          this.isLoading = false;
        });
        return;
      }
      const response = await getEmployees({ page: this.page, size: this.pageSize });

      runInAction(() => {
        this.employees = response.data.content ?? [];
        this.totalElements = response.data.page?.totalElements ?? 0;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  setPage(page: number) {
    this.page = page;
    void this.fetchEmployees();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.page = 0;
    void this.fetchEmployees();
  }

  async init() {
    await this.fetchEmployees();
  }

  get currentOfficeEmployees() {
    const currentOfficeId = timetableStore.selectedOffice?.id;
    if (!currentOfficeId) return [];
    return this.employees;
  }
}

export const employeesStore = new EmployeesStore();

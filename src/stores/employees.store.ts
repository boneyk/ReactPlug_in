import { makeAutoObservable, runInAction } from 'mobx';

import { handleNetworkError } from '../utils/errorHandlers';

import { EmployeeDto, getEmployees } from '../api/employees_service';

export type EmployeeStatus = 'ACTIVE' | 'FIRED';

export class EmployeesStore {
  employees: EmployeeDto[] = [];
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    void this.init();
  }

  async fetchEmployees() {
    this.isLoading = true;

    try {
      const response = await getEmployees();
      runInAction(() => {
        this.employees = response.data;
        this.isLoading = false;
      });
      console.log(this.employees);
    } catch (error) {
      console.error('Ошибка загрузки списка сотрудников:', error);
      runInAction(() => {
        this.isLoading = false;
      });
      handleNetworkError(error);
    }
  }

  async init() {
    void this.fetchEmployees();
  }
}

export const employeesStore = new EmployeesStore();

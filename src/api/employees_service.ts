import { AxiosResponse } from 'axios';
import {
  CreateEmployeeRequest,
  EmployeeAllDto,
  EmployeeDto,
  EmployeeListItemDto,
  GetEmployeesParams,
  UpdateEmployeeRequest
} from 'dto/DtoEmployeesService';

import { scheduleInstance } from './config';

export type * from 'dto/DtoEmployeesService';

export const getEmployees = (params?: GetEmployeesParams): Promise<AxiosResponse<EmployeeDto[]>> => {
  return scheduleInstance.get('/employees', { params });
};

export const getEmployeesAll = (): Promise<AxiosResponse<EmployeeAllDto[]>> => {
  return scheduleInstance.get('/employees/all');
};

export const getEmployeeById = (id: number): Promise<AxiosResponse<EmployeeDto>> => {
  return scheduleInstance.get(`/employees/${id}`);
};

export const createEmployee = (dto: CreateEmployeeRequest): Promise<AxiosResponse<EmployeeDto>> => {
  return scheduleInstance.post('/employees', dto);
};

export const updateEmployee = (id: number, dto: UpdateEmployeeRequest): Promise<AxiosResponse<EmployeeDto>> => {
  return scheduleInstance.put(`/employees/${id}`, dto);
};

export const fireEmployee = (id: number, firedAt: string): Promise<AxiosResponse<void>> => {
  return scheduleInstance.post(`/employees/${id}/fire`, { firedAt });
};

export const searchEmployeesByIds = (ids: number[]): Promise<AxiosResponse<EmployeeListItemDto[]>> => {
  return scheduleInstance.post('/internal/employees/search', { ids });
};

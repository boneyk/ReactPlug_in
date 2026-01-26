import { AxiosResponse } from 'axios';
import {
  CreateEmployeeRequest,
  EmployeeAllDto,
  EmployeeDto,
  EmployeeListItemDto,
  GetEmployeesParams,
  UpdateEmployeeRequest
} from 'dto/DtoEmployeesService';

import { instance } from './config';

export type * from 'dto/DtoEmployeesService';

export const getEmployees = (params?: GetEmployeesParams): Promise<AxiosResponse<EmployeeDto[]>> => {
  return instance.get('/employees', { params });
};

export const getEmployeesAll = (): Promise<AxiosResponse<EmployeeAllDto[]>> => {
  return instance.get('/employees/all');
};

export const getEmployeeById = (id: number): Promise<AxiosResponse<EmployeeDto>> => {
  return instance.get(`/employees/${id}`);
};

export const createEmployee = (dto: CreateEmployeeRequest): Promise<AxiosResponse<EmployeeDto>> => {
  return instance.post('/employees', dto);
};

export const updateEmployee = (id: number, dto: UpdateEmployeeRequest): Promise<AxiosResponse<EmployeeDto>> => {
  return instance.put(`/employees/${id}`, dto);
};

export const fireEmployee = (id: number, firedAt: string): Promise<AxiosResponse<void>> => {
  return instance.post(`/employees/${id}/fire`, { firedAt });
};

export const searchEmployeesByIds = (ids: number[]): Promise<AxiosResponse<EmployeeListItemDto[]>> => {
  return instance.post('/internal/employees/search', { ids });
};

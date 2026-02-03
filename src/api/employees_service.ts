import { AxiosResponse } from 'axios';
import {
  CreateEmployeeRequest,
  EmployeeEntityResponse,
  EmployeeResponse,
  GetEmployeesParams,
  OfficesIdsByEmployeeResponse,
  PaginatedResponse
} from 'dto/DtoEmployeesService';

import { instance } from './config';

export type * from 'dto/DtoEmployeesService';

export const addEmployeeToOffice = (
  officeId: number,
  dto: CreateEmployeeRequest
): Promise<AxiosResponse<CreateEmployeeRequest>> => {
  return instance.post(`api/offices/${officeId}/employee`, dto);
};

export const deleteEmployees = async (officeId: number, employeeIds: number[]): Promise<AxiosResponse<void>> => {
  return instance.delete(`api/office/offices/${officeId}/employee`, { data: { employeeIds } });
};

export const getEmployeeEntity = (userId: number): Promise<AxiosResponse<EmployeeEntityResponse>> => {
  return instance.get(`api/employee/employees/by-user/${userId}`);
};

export const getOfficesIdsByEmployee = (employeeId: number): Promise<AxiosResponse<OfficesIdsByEmployeeResponse[]>> => {
  return instance.get(`api/office/offices/by-employee/${employeeId}`);
};

export const getEmployeeIdsByOffices = (officeId: number): Promise<AxiosResponse<number[]>> => {
  return instance.get(`api/office/offices/${officeId}/employees`);
};

export const getEmployees = (
  params?: GetEmployeesParams
): Promise<AxiosResponse<PaginatedResponse<EmployeeResponse[]>>> => {
  return instance.get('api/employee/employees', { params });
};

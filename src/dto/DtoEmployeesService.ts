export type EmployeeStatus = 'ACTIVE' | 'FIRED';

export interface PositionDto {
  id: number;
  code: string;
  name: string;
}

export interface EmployeeDto {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  cityId: number;
  officeIds: number[];
  positionCode: string;
  positionName: string;
}

export interface EmployeeAllDto {
  id: number;
  fullName: string;
  email: string;
  positionName: string;
}

export interface EmployeeListItemDto {
  id: number;
  fullName: string;
  positionName: string;
  phone: string;
  email: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  phone?: string;
  email?: string;
  officeId: number;
  positionId: number;
  hireAt: string;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  officeId?: number;
  positionId?: number;
}

export interface GetEmployeesParams {
  officeId?: number;
  status?: EmployeeStatus;
}

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
  officeId: number;
  position: PositionDto;
  status: EmployeeStatus;
  hireAt: string;
  firedAt: string | null;
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

export interface OfficeDto {
  id: number;
  code: string;
  name: string;
  address: string;
  cityId: number;
}

export interface OfficesResponse {
  offices: OfficeDto[];
}

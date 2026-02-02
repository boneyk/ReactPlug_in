// getOffices
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

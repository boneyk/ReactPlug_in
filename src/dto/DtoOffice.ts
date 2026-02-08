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

// getOfficesTimetable
export interface OfficeTimetableDto {
  id: number;
  cityId: number;
  headId: number;
  code: string;
  name: string;
  address: string;
  workingHours: WorkingHoursDto[];
}

export interface WorkingHoursDto {
  dayOfWeek: string;
  startsOn: string;
  endsOn: string;
}

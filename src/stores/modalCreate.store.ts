import dayjs, { Dayjs } from 'dayjs';
import { CreateShiftDto, ShiftPresetDto } from 'dto/DtoScheduleService';
import { makeAutoObservable } from 'mobx';

import { timetableStore } from './timetable.store';

export interface ShiftPreset {
  id: number;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

const shiftPresetsMock: ShiftPresetDto[] = [
  { id: 1, startTime: '09:00', endTime: '18:00' },
  { id: 2, startTime: '10:00', endTime: '19:00' },
  { id: 3, startTime: '09:00', endTime: '19:00' }
];

export class TimetableCreateStore {
  startDate: Dayjs | null = null;
  endDate: Dayjs | null = null;
  selectedPresetId: number | null = null;
  presets: ShiftPreset[] = [];

  constructor() {
    makeAutoObservable(this);

    this.presets = shiftPresetsMock.map(this.mapShiftPresetDtoToModel);

    if (this.presets.length > 0) {
      this.selectPreset(this.presets[0].id);
    }
  }

  private parseTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return { hour, minute };
  };

  private mapShiftPresetDtoToModel = (dto: ShiftPresetDto): ShiftPreset => {
    const start = this.parseTime(dto.startTime);
    const end = this.parseTime(dto.endTime);
    return {
      id: dto.id,
      label: `${dto.startTime} – ${dto.endTime}`,
      startHour: start.hour,
      startMinute: start.minute,
      endHour: end.hour,
      endMinute: end.minute
    };
  };

  setStartDate = (date: Dayjs | null) => {
    this.startDate = date;
  };
  setEndDate = (date: Dayjs | null) => {
    this.endDate = date;
  };
  selectPreset = (presetId: number | null) => {
    this.selectedPresetId = presetId;
    const preset = this.presets.find((p) => p.id === presetId) || null;
    if (!preset) {
      this.startDate = null;
      this.endDate = null;
      return;
    }
    const today = dayjs();
    this.startDate = today.hour(preset.startHour).minute(preset.startMinute).second(0);
    this.endDate = today.hour(preset.endHour).minute(preset.endMinute).second(0);
  };
  reset = () => {
    this.selectedPresetId = null;
    this.startDate = null;
    this.endDate = null;
  };
  get errors() {
    const result: { start?: string; end?: string } = {};
    if (!this.startDate) result.start = 'Дата начала обязательна';
    if (!this.endDate) result.end = 'Дата окончания обязательна';
    if (this.startDate && (this.startDate.hour() < 9 || this.startDate.hour() > 19)) {
      result.start = 'Некорректное время начала смены';
    }
    if (this.endDate && (this.endDate.hour() < 9 || this.endDate.hour() > 19)) {
      result.end = 'Некорректное время окончания смены';
    }
    if (this.startDate && this.endDate && this.startDate.isAfter(this.endDate)) {
      result.start = 'Дата начала не может превышать дату конца';
      result.end = 'Дата окончания не может быть раньше даты начала';
    }
    return result;
  }

  get isValid() {
    return Object.keys(this.errors).length === 0;
  }
  get minHour(): Dayjs {
    return dayjs().hour(9).minute(0).second(0);
  }
  get maxHour(): Dayjs {
    return dayjs().hour(19).minute(0).second(0);
  }

  get createShiftDto(): CreateShiftDto | null {
    const { startDate, endDate } = this;
    const employee = timetableStore.selectedEmployee;
    if (!this.isValid || !employee || !startDate || !endDate) return null;

    return {
      employeeId: employee.id,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      startTime: startDate.format('HH:mm'),
      endTime: endDate.format('HH:mm'),
      type: 'work'
    };
  }
}
export const timetableCreateStore = new TimetableCreateStore();

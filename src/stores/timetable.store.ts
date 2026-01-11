import { makeAutoObservable } from 'mobx';

export type ShiftType = 'work' | 'vacation' | 'sick';

export interface Shift {
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  type: ShiftType;
  label?: string;
}

export interface Worker {
  phone: string;
  shifts: Shift[];
}

export type WorkersByRole = Record<string, Worker>;

export type TimetableShifts = Record<string, WorkersByRole>;

export class TimetableStore {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  calendarTranslatePx: number = 0;
  calendarMaxTranslatePx: number = 0;

  shifts: TimetableShifts = {
    'МЕНЕДЖЕР ПО РАБОТЕ С КЛИЕНТАМИ': {
      'Фадеева Надежда Богдановна': {
        phone: '+7 (915) 388-7285',
        shifts: [
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-04', endDate: '2025-12-08', type: 'work' },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-10', endDate: '2025-12-12', type: 'work' },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-15', endDate: '2025-12-19', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-22',
            endDate: '2025-12-23',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-24', endDate: '2025-12-26', type: 'work' },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-29', endDate: '2025-12-31', type: 'work' }
        ]
      },
      'Смирнов Тимур Викторович': {
        phone: '+7 (904) 730-7254',
        shifts: [
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-16', endDate: '2025-12-20', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-01', endDate: '2025-12-05', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-08',
            endDate: '2025-12-09',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-10', endDate: '2025-12-12', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-22', endDate: '2025-12-26', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-29', endDate: '2025-12-31', type: 'work' }
        ]
      },
      'Васильева Алёна Романовна': {
        phone: '+7 (579) 217-7637',
        shifts: [
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-02',
            endDate: '2025-12-05',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-16', endDate: '2025-12-18', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-08', endDate: '2025-12-12', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-19',
            endDate: '2025-12-20',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-22', endDate: '2025-12-26', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-27',
            endDate: '2025-12-28',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-29', endDate: '2025-12-31', type: 'work' }
        ]
      },
      'Яковлев Марк Артёмович': {
        phone: '+7 (021) 421-2018',
        shifts: [
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-02',
            endDate: '2025-12-06',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-08', endDate: '2025-12-12', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-16',
            endDate: '2025-12-17',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-18', endDate: '2025-12-20', type: 'work' },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-22', endDate: '2025-12-24', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-25',
            endDate: '2025-12-26',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-27', endDate: '2025-12-28', type: 'work' },
          { startTime: '09:00', endTime: '19:00', startDate: '2025-12-29', endDate: '2025-12-31', type: 'work' }
        ]
      }
    },
    'СОТРУДНИК КАССЫ': {
      'Федоров Илья Артёмович': {
        phone: '+7 (356) 171-6385',
        shifts: [
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-11', endDate: '2025-12-15', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-16', endDate: '2025-12-20', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-22',
            endDate: '2025-12-22',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-23', endDate: '2025-12-27', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-29',
            endDate: '2025-12-31',
            type: 'vacation',
            label: 'Отпуск'
          }
        ]
      },

      'Кузнецова Дарья Сергеевна': {
        phone: '+7 (926) 144-0931',
        shifts: [
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-01', endDate: '2025-12-06', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-07',
            endDate: '2025-12-07',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-08', endDate: '2025-12-12', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-15', endDate: '2025-12-19', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-23',
            endDate: '2025-12-24',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-25', endDate: '2025-12-31', type: 'work' }
        ]
      },

      'Орлов Кирилл Андреевич': {
        phone: '+7 (916) 502-7719',
        shifts: [
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-02', endDate: '2025-12-05', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-09', endDate: '2025-12-13', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-16',
            endDate: '2025-12-16',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-17', endDate: '2025-12-20', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-23', endDate: '2025-12-27', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-30', endDate: '2025-12-31', type: 'work' }
        ]
      },

      'Захарова Полина Игоревна': {
        phone: '+7 (903) 611-2084',
        shifts: [
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-03', endDate: '2025-12-07', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-10',
            endDate: '2025-12-11',
            type: 'vacation',
            label: 'Отпуск'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-12', endDate: '2025-12-16', type: 'work' },
          {
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2025-12-21',
            endDate: '2025-12-22',
            type: 'sick',
            label: 'Больничный'
          },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-23', endDate: '2025-12-28', type: 'work' },
          { startTime: '09:00', endTime: '18:00', startDate: '2025-12-29', endDate: '2025-12-31', type: 'work' }
        ]
      }
    }
  };

  constructor() {
    makeAutoObservable(this);
  }

  setCalendarMaxTranslatePx(max: number) {
    this.calendarMaxTranslatePx = Math.max(0, max);
    this.calendarTranslatePx = Math.min(this.calendarTranslatePx, this.calendarMaxTranslatePx);
  }

  resetCalendarTranslate() {
    this.calendarTranslatePx = 0;
  }

  moveCalendarLeft(stepPx: number) {
    this.calendarTranslatePx = Math.max(0, this.calendarTranslatePx - stepPx);
  }

  moveCalendarRight(stepPx: number) {
    this.calendarTranslatePx = Math.min(this.calendarMaxTranslatePx, this.calendarTranslatePx + stepPx);
  }

  incYear() {
    this.year += 1;
  }
  decYear() {
    this.year -= 1;
  }

  changeMonth(month: number) {
    this.month = month;
    this.resetCalendarTranslate();
  }
}

export const timetableStore = new TimetableStore();

import { makeAutoObservable } from 'mobx';

export type ShiftType = 'work' | 'vacation' | 'sick';

export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  type: ShiftType;
  label?: string;
}

export interface Worker {
  fullName: string;
  shifts: Shift[];
}

export type WorkersByRole = Record<string, Worker>;

export type TimetableShifts = Record<string, WorkersByRole>;

export class TimetableStore {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  calendarTranslatePx: number = 0;
  calendarMaxTranslatePx: number = 0;
  selectedRole: string | null = null;
  selectedEmployee: { id: number; name: string } | null = null;

  shifts: TimetableShifts = {
    'МЕНЕДЖЕР ПО РАБОТЕ С КЛИЕНТАМИ': {
      '101': {
        fullName: 'Фадеева Надежда Богдановна',
        shifts: [
          {
            id: 1001,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-04',
            endDate: '2026-01-08',
            type: 'work'
          },
          {
            id: 1002,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-10',
            endDate: '2026-01-12',
            type: 'work'
          },
          {
            id: 1003,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-15',
            endDate: '2026-01-19',
            type: 'work'
          },
          {
            id: 1004,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-22',
            endDate: '2026-01-23',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1005,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-24',
            endDate: '2026-01-26',
            type: 'work'
          },
          {
            id: 1006,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      },

      '102': {
        fullName: 'Смирнов Тимур Викторович',
        shifts: [
          {
            id: 1007,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-16',
            endDate: '2026-01-20',
            type: 'work'
          },
          {
            id: 1008,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-01',
            endDate: '2026-01-05',
            type: 'work'
          },
          {
            id: 1009,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-08',
            endDate: '2026-01-09',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1010,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-10',
            endDate: '2026-01-12',
            type: 'work'
          },
          {
            id: 1011,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-22',
            endDate: '2026-01-26',
            type: 'work'
          },
          {
            id: 1012,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      },

      '103': {
        fullName: 'Васильева Алёна Романовна',
        shifts: [
          {
            id: 1013,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-02',
            endDate: '2026-01-05',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1014,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-16',
            endDate: '2026-01-18',
            type: 'work'
          },
          {
            id: 1015,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-08',
            endDate: '2026-01-12',
            type: 'work'
          },
          {
            id: 1016,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-19',
            endDate: '2026-01-20',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1017,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-22',
            endDate: '2026-01-26',
            type: 'work'
          },
          {
            id: 1018,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-27',
            endDate: '2026-01-28',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1019,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      },

      '104': {
        fullName: 'Яковлев Марк Артёмович',
        shifts: [
          {
            id: 1020,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-02',
            endDate: '2026-01-06',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1021,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-08',
            endDate: '2026-01-12',
            type: 'work'
          },
          {
            id: 1022,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-16',
            endDate: '2026-01-17',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1023,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-18',
            endDate: '2026-01-20',
            type: 'work'
          },
          {
            id: 1024,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-22',
            endDate: '2026-01-24',
            type: 'work'
          },
          {
            id: 1025,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-25',
            endDate: '2026-01-26',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1026,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-27',
            endDate: '2026-01-28',
            type: 'work'
          },
          {
            id: 1027,
            startTime: '09:00',
            endTime: '19:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      }
    },

    'СОТРУДНИК КАССЫ': {
      '201': {
        fullName: 'Федоров Илья Артёмович',
        shifts: [
          {
            id: 1028,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-11',
            endDate: '2026-01-15',
            type: 'work'
          },
          {
            id: 1029,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-16',
            endDate: '2026-01-20',
            type: 'work'
          },
          {
            id: 1030,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-22',
            endDate: '2026-01-22',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1031,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-23',
            endDate: '2026-01-27',
            type: 'work'
          },
          {
            id: 1032,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'vacation',
            label: 'Отпуск'
          }
        ]
      },

      '202': {
        fullName: 'Кузнецова Дарья Сергеевна',
        shifts: [
          {
            id: 1033,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-01',
            endDate: '2026-01-06',
            type: 'work'
          },
          {
            id: 1034,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-07',
            endDate: '2026-01-07',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1035,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-08',
            endDate: '2026-01-12',
            type: 'work'
          },
          {
            id: 1036,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-15',
            endDate: '2026-01-19',
            type: 'work'
          },
          {
            id: 1037,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-23',
            endDate: '2026-01-24',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1038,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-25',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      },

      '203': {
        fullName: 'Орлов Кирилл Андреевич',
        shifts: [
          {
            id: 1039,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-02',
            endDate: '2026-01-05',
            type: 'work'
          },
          {
            id: 1040,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-09',
            endDate: '2026-01-13',
            type: 'work'
          },
          {
            id: 1041,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-16',
            endDate: '2026-01-16',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1042,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-17',
            endDate: '2026-01-20',
            type: 'work'
          },
          {
            id: 1043,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-23',
            endDate: '2026-01-27',
            type: 'work'
          },
          {
            id: 1044,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-30',
            endDate: '2026-01-31',
            type: 'work'
          }
        ]
      },

      '204': {
        fullName: 'Захарова Полина Игоревна',
        shifts: [
          {
            id: 1045,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-03',
            endDate: '2026-01-07',
            type: 'work'
          },
          {
            id: 1046,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-10',
            endDate: '2026-01-11',
            type: 'vacation',
            label: 'Отпуск'
          },
          {
            id: 1047,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-12',
            endDate: '2026-01-16',
            type: 'work'
          },
          {
            id: 1048,
            startTime: '00:00',
            endTime: '00:00',
            startDate: '2026-01-21',
            endDate: '2026-01-22',
            type: 'sick',
            label: 'Больничный'
          },
          {
            id: 1049,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-23',
            endDate: '2026-01-28',
            type: 'work'
          },
          {
            id: 1050,
            startTime: '09:00',
            endTime: '18:00',
            startDate: '2026-01-29',
            endDate: '2026-01-31',
            type: 'work'
          }
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
  get roles(): string[] {
    return Object.keys(this.shifts);
  }

  getEmployeesByRole(role: string): { id: number; name: string }[] {
    const workersByRole = this.shifts[role];
    if (!workersByRole) return [];
    return Object.entries(workersByRole).map(([id, worker]) => ({
      id: Number(id),
      name: worker.fullName
    }));
  }
  get employeeId(): number | null {
    return timetableStore.selectedEmployee?.id ?? null;
  }
  setSelectedRole = (role: string | null) => {
    this.selectedRole = role;
    this.selectedEmployee = null;
  };
  setSelectedEmployee = (employee: { id: number; name: string } | null) => {
    this.selectedEmployee = employee;
  };
}

export const timetableStore = new TimetableStore();

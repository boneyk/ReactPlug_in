import { Dayjs } from 'dayjs';

export const updateTime = (currentDate: Dayjs | null, newTime: Dayjs | null): Dayjs | null => {
  if (!newTime || !currentDate) return null;
  return currentDate.hour(newTime.hour()).minute(newTime.minute()).second(0).millisecond(0);
};

export const updateDate = (currentDate: Dayjs | null, newDate: Dayjs | null): Dayjs | null => {
  if (!newDate) return null;
  return currentDate
    ? newDate.hour(currentDate.hour()).minute(currentDate.minute()).second(currentDate.second())
    : newDate;
};

// todo: попросила бэк исправить формат данных,
// будут изначально присылать day в формате 0-6 и тогда не надо будет гонять формат
export const daysToIndex: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
};

export const dayLabel: Record<string, string> = {
  MONDAY: 'Пн',
  TUESDAY: 'Вт',
  WEDNESDAY: 'Ср',
  THURSDAY: 'Чт',
  FRIDAY: 'Пт',
  SATURDAY: 'Сб',
  SUNDAY: 'Вс'
};

export const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;

import { Dayjs } from 'dayjs';

export const updateTime = (currentDate: Dayjs | null, newTime: Dayjs | null): Dayjs | null => {
  if (!newTime || !currentDate) return null;
  return currentDate.hour(newTime.hour()).minute(newTime.minute()).second(0).millisecond(0);
};

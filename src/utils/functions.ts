export function getMonthDaysCount(year: number, month: number): number {
  const nextMonthStartDate = new Date(year, month + 1, 1);
  nextMonthStartDate.setDate(nextMonthStartDate.getDate() - 1);
  return nextMonthStartDate.getDate();
}

const weekdays = new Map<number, string>();
weekdays.set(0, 'Воскр');
weekdays.set(1, 'Понед');
weekdays.set(2, 'Вторник');
weekdays.set(3, 'Среда');
weekdays.set(4, 'Четверг');
weekdays.set(5, 'Пятница');
weekdays.set(6, 'Суббота');

export function getWeekdayByDate(year: number, month: number, day: number): string {
  return weekdays.get(new Date(year, month, day).getDay()) ?? 'Unknown';
}

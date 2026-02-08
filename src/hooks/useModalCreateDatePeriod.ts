import { useMemo } from 'react';

import { Dayjs } from 'dayjs';

import { daysToIndex } from '@/utils/dateTime';

import { timetableStore } from '@/stores/timetable.store';

type UseModalCreateDatePeriodParams = {
  date: Dayjs | null;
  error?: string;
  isEdit?: boolean;
};

export const useModalCreateDatePeriod = ({ date, error, isEdit = false }: UseModalCreateDatePeriodParams) => {
  const { officeTimetable } = timetableStore;
  return useMemo(() => {
    if (!date || !officeTimetable) {
      return {};
    }
    const dayOfWeek = daysToIndex[date.day()];
    const workingDay = officeTimetable.workingHours.find((item) => item.dayOfWeek === dayOfWeek);

    const baseConfig = {
      shouldDisableDate: (d: Dayjs) => {
        const backendDay = daysToIndex[d.day()];
        return !officeTimetable.workingHours.some((wh) => wh.dayOfWeek === backendDay);
      },
      slotProps: {
        textField: {
          error: !!error,
          helperText: '',
          inputProps: { readOnly: true }
        }
      },
      disablePast: !isEdit
    };
    if (!workingDay) {
      return {
        shouldDisableDate: () => true,
        shouldDisableTime: () => true
      };
    }

    const [startHour, startMinute] = workingDay.startsOn.split(':').map(Number);
    const [endHour, endMinute] = workingDay.endsOn.split(':').map(Number);

    return {
      ...baseConfig,
      minTime: date.hour(startHour).minute(startMinute),
      maxTime: date.hour(endHour).minute(endMinute)
    };
  }, [date, error, isEdit, officeTimetable]);
};

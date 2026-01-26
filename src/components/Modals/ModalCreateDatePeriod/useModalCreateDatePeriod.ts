import { useMemo } from 'react';

import { Dayjs } from 'dayjs';

export const useModalCreateDatePeriod = (date: Dayjs | null, error?: string) => {
  return useMemo(() => {
    if (!date) {
      return {};
    }
    const day = date.day();
    if (day === 0) {
      return {
        shouldDisableDate: () => true
      };
    }
    if (day === 6) {
      return {
        shouldDisableDate: (d: Dayjs) => d.day() === 0,
        minTime: date.hour(10).minute(0),
        maxTime: date.hour(16).minute(0),
        slotProps: {
          textField: {
            error: !!error,
            helperText: error
          }
        },
        disablePast: true
      };
    }
    return {
      shouldDisableDate: (d: Dayjs) => d.day() === 0,
      minTime: date.hour(9).minute(0),
      maxTime: date.hour(19).minute(0),
      slotProps: {
        textField: {
          error: !!error,
          helperText: error
        }
      },
      disablePast: true
    };
  }, [date, error]);
};

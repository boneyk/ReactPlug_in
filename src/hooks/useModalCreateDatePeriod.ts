import { useMemo } from 'react';

import { Dayjs } from 'dayjs';

type UseModalCreateDatePeriodParams = {
  date: Dayjs | null;
  error?: string;
  isEdit?: boolean;
};

export const useModalCreateDatePeriod = ({ date, error, isEdit = false }: UseModalCreateDatePeriodParams) => {
  return useMemo(() => {
    if (!date) {
      return {};
    }
    const day = date.day();
    const baseConfig = {
      shouldDisableDate: (d: Dayjs) => d.day() === 0,
      slotProps: {
        textField: {
          error: !!error,
          helperText: error
        }
      },
      disablePast: !isEdit
    };

    if (day === 0) {
      return {
        shouldDisableDate: () => true
      };
    }

    if (day === 6) {
      return {
        ...baseConfig,
        minTime: date.hour(10).minute(0),
        maxTime: date.hour(16).minute(0)
      };
    }

    return {
      ...baseConfig,
      minTime: date.hour(9).minute(0),
      maxTime: date.hour(19).minute(0)
    };
  }, [date, error, isEdit]);
};

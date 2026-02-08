import React, { SyntheticEvent, useMemo, useState } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';

import { dayLabel, dayOrder } from '@/utils/dateTime';

import styles from './OfficeScheduleHint.module.scss';
import { timetableStore } from '@/stores/timetable.store';

export const OfficeScheduleHint = () => {
  const { officeTimetable } = timetableStore;
  const [open, setOpen] = useState(false);

  const handleTooltipToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleTooltipClose = (_event: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      setOpen(false);
    }
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const tooltipContent = useMemo(() => {
    if (!officeTimetable) {
      return <span className={styles.hintText}>График работы офиса не задан</span>;
    }
    const workingHours = officeTimetable.workingHours ?? [];
    return (
      <>
        <Typography className={classNames(styles.hintText, styles.bold)}>Рабочие часы офиса</Typography>
        {dayOrder.map((day) => {
          const workingDay = workingHours.find((wh) => wh.dayOfWeek === day);
          return (
            <Typography key={day} className={styles.hintText}>
              <span className={styles.weekDay}>{dayLabel[day]}</span>:
              {workingDay ? ` ${workingDay.startsOn.slice(0, 5)} – ${workingDay.endsOn.slice(0, 5)}` : ' Выходной'}
            </Typography>
          );
        })}
      </>
    );
  }, [officeTimetable]);

  return (
    <Tooltip
      title={tooltipContent}
      arrow
      placement="top"
      open={open}
      onClose={handleTooltipClose}
      disableFocusListener
      disableTouchListener
      disableInteractive={false}
      slotProps={{
        tooltip: { className: styles.tooltip },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10]
              }
            }
          ],
          onMouseLeave: handleMouseLeave
        }
      }}
    >
      <IconButton className={styles.helpBtn} onClick={handleTooltipToggle} onMouseEnter={() => setOpen(true)}>
        <HelpOutlineIcon fontSize="small" className={styles.helpIcon} />
      </IconButton>
    </Tooltip>
  );
};

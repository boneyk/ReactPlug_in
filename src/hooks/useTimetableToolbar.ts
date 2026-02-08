import { useState } from 'react';

import { SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';

import { modalCreateStore } from '@/stores/modalCreate.store';
import { timetableStore } from '@/stores/timetable.store';

export const useTimetableToolbar = () => {
  const { offices, selectedOffice, year, decYear, incYear } = timetableStore;
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => {
    timetableStore.resetRoleAndPerson();
    modalCreateStore.setStartDate(dayjs());
    modalCreateStore.setEndDate(dayjs());
    modalCreateStore.selectPreset(1);
    setIsOpen(true);
  };

  const actionItems: Record<string, () => void> = {
    'Создать смену': handleOpen,
    'Создать заявку на подмену': () => console.log('2')
  };

  const handleOfficeChange = (event: SelectChangeEvent<number>) => {
    const office = offices.find((o) => o.id === event.target.value);
    if (office) {
      timetableStore.setSelectedOffice(office);
    }
  };

  return {
    offices,
    selectedOffice,
    year,
    isOpen,
    actionItems,
    decYear,
    incYear,
    handleClose,
    handleOfficeChange
  };
};

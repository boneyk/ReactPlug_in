import { FC, useState } from 'react';

import { AddCircleOutline } from '@mui/icons-material';
import { Button, FormControl, Grid2, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import arrowBack from 'assets/move-back-arrow.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';

import DropdownButton, { DropdownProvider } from '@/components/DropdownButton';
import Modal from '@/components/Modals/ModalCreate/ModalCreate';

import { isUserAdmin } from '@/utils/auth';

import styles from './TimetableCurrentDateYear.module.scss';
import { useStores } from '@/stores/useStores';

interface TimetableCurrentDateYearProps {
  showDropdown?: boolean;
}

const TimetableCurrentDateYear: FC<TimetableCurrentDateYearProps> = observer(({ showDropdown = true }) => {
  const { timetableStore } = useStores();
  const { offices, selectedOffice, year, decYear, incYear, setSelectedOffice } = timetableStore;
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => {
    timetableStore.resetRoleAndPerson();
    setIsOpen(true);
  };

  const actionItems: Record<string, () => void> = {
    'Создать смену': handleOpen,
    'Создать заявку на подмену': () => console.log('2')
  };

  const handleOfficeChange = (event: SelectChangeEvent<number>) => {
    const office = offices.find((o) => o.id === event.target.value);
    if (office) {
      setSelectedOffice(office);
    }
  };

  return (
    <Grid2 container className={styles.wrapper}>
      <Grid2 container className={styles.dateSection}>
        <Button variant="outlined" color="secondary" className={styles.yearButton} onClick={() => decYear()}>
          <img src={arrowBack} alt="-" />
        </Button>

        <span className={styles.year}>{year}</span>

        <Button variant="outlined" color="secondary" className={styles.yearButton} onClick={() => incYear()}>
          <img src={arrowForward} alt="+" />
        </Button>
      </Grid2>

      {showDropdown && (
        <DropdownProvider>
          <Grid2 container className={styles.tools}>
            {isUserAdmin() && <DropdownButton items={actionItems} icon={<AddCircleOutline />} />}
            {!isUserAdmin() && offices.length > 0 && (
              <FormControl variant="outlined" className={styles.formControl}>
                <InputLabel id="office-select-id">Офис</InputLabel>
                <Select<number>
                  labelId="office-select-id"
                  label="Офис"
                  value={selectedOffice?.id ?? 0}
                  onChange={handleOfficeChange}
                  className={styles.selectOffice}
                >
                  {offices.map((office) => (
                    <MenuItem key={`office-${office.id}`} value={office.id}>
                      {office.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid2>
        </DropdownProvider>
      )}

      <Modal notEditable={true} defaultStartDate={dayjs()} isOpen={isOpen} onClose={handleClose} />
    </Grid2>
  );
});

export default TimetableCurrentDateYear;

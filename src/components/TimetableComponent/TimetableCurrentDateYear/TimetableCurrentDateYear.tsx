import { FC, useEffect } from 'react';

import { AddCircleOutline } from '@mui/icons-material';
import { Button, FormControl, Grid2, MenuItem, Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { useQuery } from '@tanstack/react-query';
import arrowBack from 'assets/move-back-arrow.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import { observer } from 'mobx-react-lite';

import DropdownButton, { DropdownProvider } from '@/components/DropdownButton';
import Modal from '@/components/Modals/ModalCreate/ModalCreate';

import { useTimetableToolbar } from '@/hooks/useTimetableToolbar';
import { isUserAdmin } from '@/utils/auth';

import styles from './TimetableCurrentDateYear.module.scss';
import { fetchOfficeTimetable, officeTimetableKey } from '@/api/queries';
import { timetableStore } from '@/stores/timetable.store';

interface TimetableCurrentDateYearProps {
  showDropdown?: boolean;
}

const TimetableCurrentDateYear: FC<TimetableCurrentDateYearProps> = observer(({ showDropdown = true }) => {
  const { offices, selectedOffice, year, isOpen, actionItems, decYear, incYear, handleClose, handleOfficeChange } =
    useTimetableToolbar();

  const officeId = selectedOffice?.id;

  const officeTimetable = useQuery({
    queryKey: officeId ? officeTimetableKey(officeId) : ['officesTimetable-disabled'],
    queryFn: fetchOfficeTimetable,
    enabled: !!officeId
  });

  useEffect(() => {
    if (officeTimetable.data) timetableStore.setOfficeTimetable(officeTimetable.data);
  }, [officeTimetable.data]);

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

      <Modal isRoleSelectionDisabled={false} isOpen={isOpen} onClose={handleClose} isEdit={false} />
    </Grid2>
  );
});

export default TimetableCurrentDateYear;

import { FC } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid2, SelectChangeEvent } from '@mui/material';

import styles from '../EmployeesTable.module.scss';
import PositionFilter from '../PositionFilter';

interface EmployeesTableToolbarProps {
  address: string;
  positions: string[];
  selectedPositions: string[];
  isSmallDisplay: boolean;
  onPositionChange: (event: SelectChangeEvent<string[]>) => void;
  onAddEmployee: () => void;
  onDeleteEmployee: () => void;
}

const EmployeesTableToolbar: FC<EmployeesTableToolbarProps> = ({
  address,
  positions,
  selectedPositions,
  isSmallDisplay,
  onPositionChange,
  onAddEmployee,
  onDeleteEmployee
}) => (
  <Grid2 container className={styles.infoButtons}>
    <Box>{address}</Box>
    <Grid2 className={styles.actionButtons}>
      <Button
        startIcon={isSmallDisplay ? null : <DeleteIcon />}
        variant="outlined"
        color="secondary"
        className={styles.outlinedSpecial}
        disableRipple
        onClick={onDeleteEmployee}
      >
        {isSmallDisplay ? <DeleteIcon /> : 'Удалить'}
      </Button>
      <PositionFilter
        positions={positions}
        selectedPositions={selectedPositions}
        isSmallDisplay={isSmallDisplay}
        onChange={onPositionChange}
      />
      <Button
        startIcon={isSmallDisplay ? null : <AddIcon />}
        variant="contained"
        color="primary"
        className={styles.containedSpecial}
        onClick={onAddEmployee}
      >
        {isSmallDisplay ? <AddIcon /> : 'Добавить сотрудника в офис'}
      </Button>
    </Grid2>
  </Grid2>
);

export default EmployeesTableToolbar;

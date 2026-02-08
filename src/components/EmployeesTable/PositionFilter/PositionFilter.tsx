import { FC } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Checkbox, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import styles from '../EmployeesTable.module.scss';

interface PositionFilterProps {
  positions: string[];
  selectedPositions: string[];
  isSmallDisplay: boolean;
  onChange: (event: SelectChangeEvent<string[]>) => void;
}

const FilterButton: FC<{ isSmallDisplay: boolean }> = ({ isSmallDisplay }) => (
  <Box className={styles.filterButton}>
    <FilterListIcon />
    {!isSmallDisplay && 'Фильтр'}
  </Box>
);

const PositionFilter: FC<PositionFilterProps> = ({ positions, selectedPositions, isSmallDisplay, onChange }) => (
  <FormControl size="small" className={styles.filterSelect}>
    <Select
      multiple
      value={selectedPositions}
      onChange={onChange}
      displayEmpty
      IconComponent={() => null}
      disabled={positions.length === 0}
      renderValue={() => <FilterButton isSmallDisplay={isSmallDisplay} />}
      className={styles.filterSelect}
    >
      {positions.map((position) => (
        <MenuItem key={position} value={position}>
          <Checkbox checked={selectedPositions.includes(position)} />
          <ListItemText primary={position} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default PositionFilter;

import { FC, useMemo, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useQuery } from '@tanstack/react-query';

import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';

import styles from './ModalAddWorkerContent.module.scss';
import { employeesByCityKey, fetchEmployeesByCity } from '@/api/queries';
import { scoredSearch } from '@/lib/employee';
import { timetableStore } from '@/stores/timetable.store';
import { useStores } from '@/stores/useStores';

const ADD_WORKERS_COLUMNS = [
  {
    field: 'fullName',
    headerName: 'ФИО',
    editable: false,
    flex: 1
  },
  {
    field: 'work',
    headerName: 'Должность',
    editable: false,
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Почта',
    editable: false,
    flex: 1
  }
];

interface ModalAddWorkerContentProps {
  onSelectionChange: (ids: GridRowSelectionModel) => void;
}

const ModalAddWorkerContent: FC<ModalAddWorkerContentProps> = ({ onSelectionChange }) => {
  const { employeesStore } = useStores();
  const [searchQuery, setSearchQuery] = useState('');
  const cityId = timetableStore.selectedOffice?.cityId;

  const employeesQuery = useQuery({
    queryKey: cityId ? employeesByCityKey(cityId) : ['employeesByCity-disabled'],
    queryFn: fetchEmployeesByCity,
    enabled: !!cityId
  });

  const rows = useMemo(() => {
    const dataSource = employeesQuery.data?.content ?? employeesStore.currentOfficeEmployees;
    const mapped = dataSource.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      work: employee.position.name ?? ''
    }));

    if (!searchQuery) return mapped;
    return scoredSearch(searchQuery, mapped);
  }, [employeesQuery.data, employeesStore.currentOfficeEmployees, searchQuery]);

  return (
    <>
      <TextField
        placeholder="ФИО или почта сотрудника"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            className: styles.searchInputRoot
          },
          htmlInput: {
            className: styles.searchInput
          }
        }}
        className={styles.search}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <DataGrid
        columns={ADD_WORKERS_COLUMNS}
        disableColumnFilter
        disableColumnSorting
        disableColumnResize
        disableColumnMenu
        hideFooter
        checkboxSelection
        classes={{
          columnHeaderTitle: styles.columnTitle,
          columnHeaderTitleContainer: styles.headerContainer,
          overlay: styles.emptyDataRow,
          columnHeader: styles.columnHeader,
          columnHeaders: styles.columnHeaders,
          cell: styles.searchCell,
          checkboxInput: styles.checkbox,
          scrollbarFiller: styles.scrollbarFiller,
          row: styles.row
        }}
        loading={employeesQuery.isLoading}
        rows={rows}
        className={styles.grid}
        localeText={{ noRowsLabel: 'Сотрудники не найдены' }}
        getRowHeight={() => 'auto'}
        onRowSelectionModelChange={onSelectionChange}
      />
    </>
  );
};

export default ModalAddWorkerContent;

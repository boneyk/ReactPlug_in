import { useEffect, useMemo, useState } from 'react';

import { Box, Grid2, SelectChangeEvent } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { DataGrid } from '@mui/x-data-grid';

import { useStores } from '../../stores/useStores';

import styles from './EmployeesTable.module.scss';
import EmployeesTableToolbar from './EmployeesTableToolbar';

const EMPLOYEES_TABLE_COLUMNS = [
  {
    field: 'fullName',
    headerName: 'ФИО сотрудника',
    editable: false,
    flex: 1
  },
  {
    field: 'email',
    headerName: 'Почта',
    editable: false,
    flex: 1
  },
  {
    field: 'work',
    headerName: 'Должность',
    editable: false,
    flex: 1
  }
];

const handleAddEmployee = () => {
  console.log('Добавить сотрудника :)');
};

const handleDeleteEmployee = () => {
  console.log('Удалить сотрудника :)');
};

const EmployeesTable = observer(() => {
  const { employeesStore } = useStores();
  const { employees, isLoading } = employeesStore;

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isSmallDisplay, setIsSmallDisplay] = useState(window.innerWidth < 600);

  const positions = useMemo(() => {
    const positionNames = employees
      .map((employee) => employee.position?.name)
      .filter((name): name is string => Boolean(name));
    return [...new Set(positionNames)];
  }, [employees]);

  const rows = useMemo(() => {
    const allRows = employees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      work: employee.position?.name ?? ''
    }));

    if (selectedPositions.length === 0) {
      return allRows;
    }

    return allRows.filter((row) => selectedPositions.includes(row.work));
  }, [employees, selectedPositions]);

  const handlePositionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedPositions(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDisplay(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Grid2 container className={styles.wrapper}>
      <h1>Сотрудники офиса</h1>
      <Grid2 container className={styles.table}>
        <EmployeesTableToolbar
          address="ул. Светланская, д.32"
          positions={positions}
          selectedPositions={selectedPositions}
          isSmallDisplay={isSmallDisplay}
          onPositionChange={handlePositionChange}
          onAddEmployee={handleAddEmployee}
          onDeleteEmployee={handleDeleteEmployee}
        />
        <Box className={styles.tableBox}>
          <DataGrid
            columns={EMPLOYEES_TABLE_COLUMNS}
            rows={rows}
            loading={isLoading}
            disableColumnResize
            disableColumnMenu
            checkboxSelection
            getRowHeight={() => 'auto'}
            className={styles.data}
            localeText={{ noRowsLabel: 'Сотрудники не найдены' }}
          />
        </Box>
      </Grid2>
    </Grid2>
  );
});

export default EmployeesTable;

import { useEffect, useMemo, useState } from 'react';

import { Box, Grid2, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';

import { DataGrid, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';

import styles from './EmployeesTable.module.scss';
import EmployeesTableToolbar from './EmployeesTableToolbar';
import { deleteEmployees } from '@/api/employees_service';
import { baseLayoutStore } from '@/stores/baseLayout.store';
import { timetableStore } from '@/stores/timetable.store';
import { useStores } from '@/stores/useStores';

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

const EmployeesTable = observer(() => {
  const { employeesStore } = useStores();
  const { currentOfficeEmployees, isLoading, page, pageSize, totalElements } = employeesStore;

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isSmallDisplay, setIsSmallDisplay] = useState(window.innerWidth < 600);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const positions = useMemo(() => {
    const positionNames = currentOfficeEmployees
      .map((currentOfficeEmployees) => currentOfficeEmployees.position.name)
      .filter((name): name is string => Boolean(name));
    return [...new Set(positionNames)];
  }, [currentOfficeEmployees]);

  const rows = useMemo(() => {
    const allRows = currentOfficeEmployees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      work: employee.position.name ?? ''
    }));

    if (selectedPositions.length === 0) {
      return allRows;
    }

    return allRows.filter((row) => selectedPositions.includes(row.work));
  }, [currentOfficeEmployees, selectedPositions]);

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

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.pageSize !== pageSize) {
      employeesStore.setPageSize(model.pageSize);
    } else if (model.page !== page) {
      employeesStore.setPage(model.page);
    }
  };

  const handleDeleteEmployee = async () => {
    if (rowSelectionModel.length === 0) {
      baseLayoutStore.showWarning('Сначала выберите сотрудника');
      return;
    }
    const employeeIds = rowSelectionModel as number[];
    try {
      if (timetableStore.selectedOffice?.id) {
        await deleteEmployees(timetableStore.selectedOffice.id, employeeIds);
      }
      await employeesStore.fetchEmployees();
      setRowSelectionModel([]);
    } catch (error) {
      let message = 'Ошибка при удалении сотрудника';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail ?? message;
      }
      baseLayoutStore.showWarning(message);
    }
  };

  return (
    <Grid2 container className={styles.wrapper}>
      <h1>Сотрудники офиса</h1>
      <Grid2 container className={styles.table}>
        <EmployeesTableToolbar
          address={timetableStore.selectedOffice?.address ?? 'Офис не определен'}
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
            rowCount={totalElements}
            loading={isLoading}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            disableColumnResize
            disableColumnMenu
            checkboxSelection
            getRowHeight={() => 'auto'}
            className={styles.data}
            localeText={{ noRowsLabel: 'Сотрудники не найдены' }}
            onRowSelectionModelChange={setRowSelectionModel}
          />
        </Box>
      </Grid2>
    </Grid2>
  );
});

export default EmployeesTable;

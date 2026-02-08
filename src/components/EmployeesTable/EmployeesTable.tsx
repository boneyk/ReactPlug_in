import { useEffect, useMemo, useState } from 'react';

import { Box, Grid2, SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { observer } from 'mobx-react-lite';

import ModalAddWorker from '@/components/Modals/ModalAddWorker';

import { useEmployeeOffices } from '@/hooks/useEmployeeOffices';
import { DataGrid, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';

import styles from './EmployeesTable.module.scss';
import EmployeesTableToolbar from './EmployeesTableToolbar';
import { deleteEmployees } from '@/api/employees_service';
import {
  employeeIdsByOfficeKey,
  employeesByIdsKey,
  fetchEmployeeIdsByOffice,
  fetchEmployeesByIds,
  queryClient
} from '@/api/queries';
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

const EmployeesTable = observer(() => {
  const { employeesStore } = useStores();
  const { currentOfficeEmployees, page, pageSize, totalElements, setAddEmployeeDialogVisibility } = employeesStore;
  const { employeeQuery, officesQuery } = useEmployeeOffices();

  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isSmallDisplay, setIsSmallDisplay] = useState(window.innerWidth < 700);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const handleAddEmployee = () => {
    setAddEmployeeDialogVisibility(true);
  };

  const officeId = timetableStore.selectedOffice?.id;
  const employeeIdsQuery = useQuery({
    queryKey: officeId ? employeeIdsByOfficeKey(officeId) : ['employeeIds-disabled'],
    queryFn: fetchEmployeeIdsByOffice,
    enabled: !!officeId
  });

  useEffect(() => {
    if (!timetableStore.selectedOffice && officesQuery.data?.length && employeeQuery.data) {
      timetableStore.setSelectedOffice(officesQuery.data[0]);
      timetableStore.setOffices(officesQuery.data);
      timetableStore.setEmployee(employeeQuery.data);
    }
  }, [officesQuery.data, employeeQuery.data]);

  const employeesQuery = useQuery({
    queryKey: employeeIdsQuery.data
      ? employeesByIdsKey(employeeIdsQuery.data, employeesStore.page, employeesStore.pageSize)
      : ['employees-disabled'],
    queryFn: fetchEmployeesByIds,
    enabled: !!employeeIdsQuery.data
  });

  const isLoading = employeeIdsQuery.isLoading || employeesQuery.isLoading;

  useEffect(() => {
    if (employeesQuery.data) {
      employeesStore.setEmployees(employeesQuery.data.content ?? []);
      employeesStore.setTotalElements(employeesQuery.data.page?.totalElements ?? 0);
    }
  }, [employeesQuery.data, employeesStore]);

  const positions = useMemo(() => {
    const positionNames = currentOfficeEmployees
      .map((employee) => employee.position.name)
      .filter((name): name is string => Boolean(name));
    const result = [...new Set(positionNames)];
    return result;
  }, [currentOfficeEmployees]);

  const rows = useMemo(() => {
    const allRows = currentOfficeEmployees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      work: employee.position.name ?? ''
    }));

    const result =
      selectedPositions.length === 0 ? allRows : allRows.filter((row) => selectedPositions.includes(row.work));

    return result;
  }, [currentOfficeEmployees, selectedPositions]);

  const handlePositionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const parsed = typeof value === 'string' ? value.split(',') : value;
    setSelectedPositions(parsed);
  };

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 700;
      setIsSmallDisplay(small);
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
      if (!officeId) return;
      await deleteEmployees(officeId, employeeIds);

      await queryClient.invalidateQueries({
        queryKey: employeeIdsByOfficeKey(officeId)
      });

      await queryClient.invalidateQueries({
        queryKey: ['employeesByIds']
      });
      await queryClient.invalidateQueries({
        queryKey: ['schedule']
      });

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
    <>
      <ModalAddWorker />
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
    </>
  );
});

export default EmployeesTable;

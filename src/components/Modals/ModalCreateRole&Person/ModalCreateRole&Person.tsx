import { FC } from 'react';

import { Autocomplete, Grid2, MenuItem, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores/useStores';

import styles from '../ModalCreate/ModalCreate.module.scss';

type ModalCreateRoleAndPersonProps = {
  isDisabled: boolean;
};

export const ModalCreateRoleAndPerson: FC<ModalCreateRoleAndPersonProps> = observer(({ isDisabled }) => {
  const { timetableStore } = useStores();
  const { roles, selectedRole, selectedEmployee, getEmployeesByRole, setSelectedRole, setSelectedEmployee } =
    timetableStore;
  const employees = selectedRole ? getEmployeesByRole(selectedRole) : [];
  const roleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };
  const changeEmployee = (_: unknown, value: { id: number; name: string } | null) => {
    setSelectedEmployee(value);
  };
  const getOptionLabel = (option: { id: number; name: string }) => option.name;
  const isOptionEqualToValue = (option: { id: number; name: string }, value: { id: number; name: string }) =>
    option.name === value.name;

  const roleLabel = !isDisabled ? 'Выберите должность' : 'Должность:';
  const employeeLabel = !isDisabled ? 'Выберите сотрудника' : 'Сотрудник:';

  if (!isDisabled) {
    return (
      <Grid2 container spacing={2} alignItems="center" className={styles.container}>
        <TextField
          select
          label={roleLabel}
          value={selectedRole || ''}
          onChange={roleChange}
          fullWidth
          error={!selectedRole}
          className={styles.picker}
          helperText={!selectedRole ? 'Должность обязательна' : ''}
          slotProps={{
            input: {
              readOnly: false
            }
          }}
        >
          {roles.map((roleName) => (
            <MenuItem key={roleName} value={roleName}>
              {roleName}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          options={employees}
          value={selectedEmployee || null}
          onChange={changeEmployee}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          noOptionsText="Нет сотрудников"
          renderInput={(params) => (
            <TextField
              {...params}
              label={employeeLabel}
              placeholder="Начните вводить ФИО"
              error={!selectedEmployee}
              helperText={!selectedEmployee ? 'Сотрудник обязателен' : ''}
              className={styles.picker}
            />
          )}
          fullWidth
        />
      </Grid2>
    );
  }

  return (
    <Grid2 container className={styles.containerInfo}>
      <Grid2 className={styles.infoRow}>
        <Typography variant="subtitle2" color="text.secondary">
          {roleLabel}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {selectedRole || '—'}
        </Typography>
      </Grid2>

      <Grid2 className={styles.infoRow}>
        <Typography variant="subtitle2" color="text.secondary">
          {employeeLabel}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {selectedEmployee?.name || '—'}
        </Typography>
      </Grid2>
    </Grid2>
  );
});

import { FC } from 'react';

import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { timetableStore } from 'stores/timetable.store';

import styles from '../ModalCreate/ModalCreate.module.scss';

export const RoleAndPerson: FC = observer(() => {
  const { roles, selectedRole, selectedEmployee } = timetableStore;
  const employees = selectedRole ? timetableStore.getEmployeesByRole(selectedRole) : [];

  return (
    <Stack direction="row" spacing={1} className={styles.container}>
      <PersonIcon />
      <TextField
        select
        label="Выберите должность"
        value={selectedRole ?? ''}
        onChange={(e) => timetableStore.setSelectedRole(e.target.value)}
        fullWidth
        error={!selectedRole}
        helperText={!selectedRole ? 'Должность обязательна' : ''}
      >
        {roles.map((roleName) => (
          <MenuItem key={roleName} value={roleName}>
            {roleName}
          </MenuItem>
        ))}
      </TextField>
      <Autocomplete
        options={employees}
        value={selectedEmployee}
        onChange={(_, value) => timetableStore.setSelectedEmployee(value)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выберите сотрудника"
            placeholder="Начните вводить ФИО"
            error={!selectedEmployee}
            helperText={!selectedEmployee ? 'Сотрудник обязателен' : ''}
          />
        )}
        disabled={!selectedRole}
        fullWidth
      />
    </Stack>
  );
});

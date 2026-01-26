import { FC } from 'react';

import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores/useStores';

import styles from '../ModalCreate/ModalCreate.module.scss';

type ModalCreateRoleAndPersonProps = {
  notEditable: boolean;
};

export const ModalCreateRoleAndPerson: FC<ModalCreateRoleAndPersonProps> = observer(({ notEditable }) => {
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
  const optionEqualToValue = (option: { id: number; name: string }, value: { id: number; name: string }) => {
    return option.name === value.name;
  };
  const option = (option: { id: number; name: string }) => {
    return option.name;
  };
  return (
    <Stack direction="row" spacing={1} className={styles.container}>
      <PersonIcon />
      <TextField
        select
        label="Выберите должность"
        value={selectedRole}
        onChange={roleChange}
        fullWidth
        error={!selectedRole}
        helperText={!selectedRole ? 'Должность обязательна' : ''}
        disabled={!notEditable}
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
        getOptionLabel={option}
        isOptionEqualToValue={optionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выберите сотрудника"
            placeholder="Начните вводить ФИО"
            error={!selectedEmployee}
            helperText={!selectedEmployee ? 'Сотрудник обязателен' : ''}
          />
        )}
        disabled={!notEditable || !selectedRole}
        fullWidth
      />
    </Stack>
  );
});

import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';

const EditModal = () => {
  const [formData] = useState({
    field1: '',
    field2: '',
    field3: '',
    employee: '',
    role: ''
  });

  const employees = [
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Петр Петров' },
    { id: 3, name: 'Анна Смирнова' }
  ];

  const roles = [
    { id: 1, role: 'Кассир' },
    { id: 2, role: 'Менеджер по работе с клиентами' },
    { id: 3, role: 'Менеджер по работе с юридическими лицами' },
    { id: 4, role: 'Менеджер по работе с ВИП клиентами' }
  ];

  const handleSave = () => {
    console.log('Сохранено:', formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={true} maxWidth="md" fullWidth>
        <DialogTitle>{`Редактирование данных`}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            {/* <TextField label="День" fullWidth value={formData.field1} /> */}
            <DesktopDatePicker defaultValue={dayjs('2022-04-17')} />
            <TextField label="Начало смены" fullWidth value={formData.field2} />
            <TextField label="Конец смены" fullWidth value={formData.field3} />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="employee-label">{`Сотрудник`}</InputLabel>
              <Select labelId="employee-label" label="Сотрудник" value={formData.employee}>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="employee-label">{`Роль`}</InputLabel>
              <Select labelId="employee-label" label="Роль" value={formData.role}>
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button>{`Отмена`}</Button>
          <Button variant="contained" onClick={handleSave}>{`Сохранить`}</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditModal;

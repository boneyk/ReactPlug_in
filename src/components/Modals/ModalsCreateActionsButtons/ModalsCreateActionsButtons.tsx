import { FC, useState } from 'react';

import { Alert, AlertTitle, Button } from '@mui/material';
import { createShift } from 'api/shedule_service';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';
import { useStores } from 'stores/useStores';

interface ModalCreateActionsButtonsProps {
  onClose: () => void;
}
export const ModalCreateActionsButtons: FC<ModalCreateActionsButtonsProps> = observer(({ onClose }) => {
  const { timetableStore } = useStores();
  const { selectedRole, selectedEmployee, selectedOffice, year, month, fetchSchedule } = timetableStore;
  const { errors, isValid, createShiftDto } = timetableCreateStore;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const canSave = isValid && !!selectedRole && !!selectedEmployee;

  const errorText =
    errors.start ||
    errors.end ||
    (!selectedRole && 'Не выбрана должность') ||
    (!selectedEmployee && 'Не выбран сотрудник') ||
    submitError;

  const onSubmit = async () => {
    if (!createShiftDto) return;
    try {
      setSubmitError(null);
      await createShift(createShiftDto);
      onClose();
      if (selectedOffice) {
        await fetchSchedule(selectedOffice.id, year, month);
      }
    } catch (err: unknown) {
      let message = 'Ошибка при удалении смены';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail ?? message;
      }
      setSubmitError(message);
    }
  };

  return (
    <>
      {errorText && (
        <Alert severity="error">
          <AlertTitle>Ошибка</AlertTitle>
          {errorText}
        </Alert>
      )}
      <Button variant="contained" onClick={onSubmit} disabled={!canSave}>
        Сохранить
      </Button>
    </>
  );
});

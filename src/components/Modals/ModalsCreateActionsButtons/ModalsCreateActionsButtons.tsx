import { useState } from 'react';

import { Alert, AlertTitle, Button } from '@mui/material';
import { createShift } from 'api/shedule_service';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';
import { timetableStore } from 'stores/timetable.store';

interface Props {
  onClose: () => void;
}

export const ActionsButtons = observer(({ onClose }: Props) => {
  const { errors, isValid, createShiftDto } = timetableCreateStore;
  const { selectedRole, selectedEmployee } = timetableStore;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSave = isValid && selectedRole && selectedEmployee;

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
      console.log('DTO для отправки:', createShiftDto);
      await createShift(createShiftDto);
      onClose();
      timetableStore.loadShifts(timetableStore.year, timetableStore.month + 1);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setSubmitError(err.response.data.detail);
      } else if (err.message) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Произошла неизвестная ошибка');
      }
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

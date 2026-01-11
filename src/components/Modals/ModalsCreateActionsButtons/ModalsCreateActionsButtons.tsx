import { Alert, AlertTitle, Button } from '@mui/material';
import { createShift } from 'api/shedule_service';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';
import { timetableStore } from 'stores/timetable.store';

export const ActionsButtons = observer(() => {
  const { errors, isValid, createShiftDto } = timetableCreateStore;
  const { selectedRole, selectedEmployee } = timetableStore;

  const canSave = isValid && selectedRole && selectedEmployee;

  const errorText =
    errors.start ||
    errors.end ||
    (!selectedRole && 'Не выбрана должность') ||
    (!selectedEmployee && 'Не выбран сотрудник');

  const onSubmit = async () => {
    if (!createShiftDto) return;
    console.log('DTO для отправки:', createShiftDto);
    await createShift(createShiftDto);
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

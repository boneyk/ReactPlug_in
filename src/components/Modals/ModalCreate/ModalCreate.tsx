import { FC } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { DatePeriod } from '../ModalCreateDatePeriod/ModalCreateDatePeriod';
import { Pressets } from '../ModalCreatePressets/ModalCreatePressets';
import { RoleAndPerson } from '../ModalCreateRole&Person/ModalCreateRole&Person';
import { Title } from '../ModalCreateTitle/ModalCreateTitle';
import { ActionsButtons } from '../ModalsCreateActionsButtons/ModalsCreateActionsButtons';

interface TimetableModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimetableModalCreate: FC<TimetableModalCreateProps> = observer(({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Title onClose={onClose} />
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="column" spacing={3}>
          <Pressets />
          <DatePeriod />
          <RoleAndPerson />
        </Stack>
      </DialogContent>

      <DialogActions>
        <ActionsButtons />
      </DialogActions>
    </Dialog>
  );
});

export default TimetableModalCreate;

import { FC } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Dayjs } from 'dayjs';

import { ModalCreateDatePeriod } from '../ModalCreateDatePeriod/ModalCreateDatePeriod';
import { ModalCreatePressets } from '../ModalCreatePressets/ModalCreatePressets';
import { ModalCreateRoleAndPerson } from '../ModalCreateRole&Person/ModalCreateRole&Person';
import { ModalCreateTitle } from '../ModalCreateTitle/ModalCreateTitle';
import { ModalCreateActionsButtons } from '../ModalsCreateActionsButtons/ModalsCreateActionsButtons';

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  notEditable: boolean;
  defaultStartDate: Dayjs | null;
}

const ModalCreate: FC<ModalCreateProps> = ({ isOpen, onClose, notEditable, defaultStartDate }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <ModalCreateTitle onClose={onClose} />
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="column" spacing={3}>
          <ModalCreatePressets />
          <ModalCreateDatePeriod defaultStartDate={defaultStartDate} />
          <ModalCreateRoleAndPerson notEditable={notEditable} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <ModalCreateActionsButtons onClose={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreate;

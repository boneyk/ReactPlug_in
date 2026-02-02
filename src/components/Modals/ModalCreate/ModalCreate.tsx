import { FC } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Dayjs } from 'dayjs';

import { ModalCreateDatePeriod } from '../ModalCreateDatePeriod/ModalCreateDatePeriod';
import { ModalCreatePressets } from '../ModalCreatePressets/ModalCreatePressets';
import { ModalCreateRoleAndPerson } from '../ModalCreateRole&Person/ModalCreateRole&Person';
import { ModalCreateTitle } from '../ModalCreateTitle/ModalCreateTitle';
import { ModalCreateActionsButtons } from '../ModalsCreateActionsButtons/ModalsCreateActionsButtons';

import styles from './ModalCreate.module.scss';

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  isRoleSelectionDisabled?: boolean;
  isEdit?: boolean;
  defaultStartDate?: Dayjs | null;
}
const ModalCreate: FC<ModalCreateProps> = ({
  isOpen,
  onClose,
  isRoleSelectionDisabled = false,
  isEdit = false,
  defaultStartDate = null
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.wrapper}>
      <DialogTitle>
        <ModalCreateTitle onClose={onClose} isEdit={isEdit} />
      </DialogTitle>

      <DialogContent dividers className={styles.content}>
        <Stack direction="column" spacing={3}>
          <ModalCreatePressets />
          <ModalCreateDatePeriod defaultStartDate={defaultStartDate} isEdit={isEdit} />
          <ModalCreateRoleAndPerson isDisabled={isRoleSelectionDisabled} />
        </Stack>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <ModalCreateActionsButtons onClose={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default ModalCreate;

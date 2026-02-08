import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { ModalViewButtons } from '../ModalViewButtons/ModalViewButtons';
import { ModalViewShiftInfo } from '../ModalViewShiftInfo/ModalViewShiftInfo';
import { ModalViewShiftTitle } from '../ModalViewShiftTitle/ModalViewShiftTitle';

import styles from './ModalView.module.scss';
import { modalViewStore } from '@/stores/modalView.store';

const ModalView = observer(() => {
  const { isOpen, shiftData } = modalViewStore;

  const handleClose = () => {
    modalViewStore.close();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.wrapper}>
        {!shiftData ? (
          <Typography color="text.secondary">Нет данных о смене</Typography>
        ) : (
          <ModalViewShiftTitle shiftData={shiftData} />
        )}
        {shiftData && <ModalViewButtons onClose={handleClose} shift={shiftData} />}
      </DialogTitle>
      <DialogContent dividers className={styles.content}>
        {!shiftData ? (
          <Typography color="text.secondary">Нет данных о смене</Typography>
        ) : (
          <ModalViewShiftInfo shiftData={shiftData} />
        )}
      </DialogContent>
    </Dialog>
  );
});

export default ModalView;

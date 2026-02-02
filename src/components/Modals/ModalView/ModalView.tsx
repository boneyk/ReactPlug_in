import { FC } from 'react';

import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

import { ShiftModalData } from '@/hooks/useViewModal';

import { ModalViewButtons } from '../ModalViewButtons/ModalViewButtons';
import { ModalViewShiftInfo } from '../ModalViewShiftInfo/ModalViewShiftInfo';
import { ModalViewShiftTitle } from '../ModalViewShiftTitle/ModalViewShiftTitle';

import styles from './ModalView.module.scss';

interface TimetableModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  shiftData: ShiftModalData | null;
}

const TimetableModalView: FC<TimetableModalViewProps> = ({ isOpen, onClose, shiftData }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.wrapper}>
        {!shiftData ? (
          <Typography color="text.secondary">Нет данных о смене</Typography>
        ) : (
          <ModalViewShiftTitle shiftData={shiftData} />
        )}
        {shiftData && <ModalViewButtons onClose={onClose} shift={shiftData} />}
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
};

export default TimetableModalView;

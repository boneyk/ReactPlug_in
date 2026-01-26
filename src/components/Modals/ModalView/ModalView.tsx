import { FC } from 'react';

import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

import { ModalViewButtons } from '../ModalViewButtons/ModalViewButtons';
import { ModalViewShiftInfo } from '../ModalViewShiftInfo/ModalViewShiftInfo';
import { ModalViewShiftTitle } from '../ModalViewShiftTitle/ModalViewShiftTitle';

import { ShiftModalData } from './useViewModal';

interface TimetableModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  shiftData: ShiftModalData | null;
}

const TimetableModalView: FC<TimetableModalViewProps> = ({ isOpen, onClose, shiftData }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {!shiftData ? (
          <Typography color="text.secondary">Нет данных о смене</Typography>
        ) : (
          <ModalViewShiftTitle shiftData={shiftData} />
        )}
      </DialogTitle>
      {shiftData && <ModalViewButtons onClose={onClose} shift={shiftData} />}
      <DialogContent dividers>
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

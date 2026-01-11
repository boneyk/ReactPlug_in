import { FC } from 'react';

import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ShiftType } from 'stores/timetable.store';

import { ShiftButtons } from '../ModalViewShiftButtons/ModalViewButtons';
import { ShiftInfo } from '../ModalViewShiftInfo/ModalViewShiftInfo';
import { ShiftTitle } from '../ModalViewShiftTitle/ModalViewShiftTitle';

export interface ShiftModalData {
  fullname: string;
  job: string;
  dayIndex: number;
  type: ShiftType;
  text: string;
  spanDays: number;
}

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
          <ShiftTitle shiftData={shiftData} />
        )}
      </DialogTitle>
      <ShiftButtons onClose={onClose} />
      <DialogContent dividers>
        {!shiftData ? (
          <Typography color="text.secondary">Нет данных о смене</Typography>
        ) : (
          <ShiftInfo shiftData={shiftData} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TimetableModalView;

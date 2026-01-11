import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';

import styles from '../../Modals/ModalView/ModalView.module.scss';

interface TimetableModalViewProps {
  onClose: () => void;
}

export const ShiftButtons: FC<TimetableModalViewProps> = ({ onClose }) => {
  return (
    <Stack direction="row" spacing={1} className={styles.stackPosition}>
      <IconButton>
        {/* TODO: добавить логику редактирования при нажатии на иконку (задача ORNG-134) */}
        <EditIcon />
      </IconButton>
      <IconButton>
        {/* TODO: добавить логику удаления при нажатии на иконку (задача ORNG-135) */}
        <DeleteForeverIcon />
      </IconButton>
      <IconButton aria-label="close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

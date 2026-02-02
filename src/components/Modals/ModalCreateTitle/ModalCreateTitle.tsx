import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, Typography } from '@mui/material';

import styles from '../ModalCreateTitle/ModalCreateTitle.module.scss';

interface ModalCreateProps {
  onClose: () => void;
  isEdit: boolean;
}
const changeTitle = (isEdit: boolean) => {
  if (isEdit) {
    return 'Редактирование смены';
  } else {
    return 'Создание смены';
  }
};
export const ModalCreateTitle: FC<ModalCreateProps> = ({ onClose, isEdit }) => {
  return (
    <Stack direction="row" spacing={1} className={styles.container}>
      <Typography variant="h5">{changeTitle(isEdit)}</Typography>
      <IconButton aria-label="close" onClick={onClose} className={styles.icons}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

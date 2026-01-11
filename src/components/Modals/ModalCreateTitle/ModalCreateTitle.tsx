import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, Typography } from '@mui/material';

import styles from '../ModalCreateTitle/ModalCreateTitle.module.scss';

interface TimetableModalCreateProps {
  onClose: () => void;
}

export const Title: FC<TimetableModalCreateProps> = ({ onClose }) => {
  return (
    <Stack direction="row" spacing={1} className={styles.container}>
      <Typography variant="h5">Создание смены</Typography>
      <IconButton aria-label="close" onClick={onClose} className={styles.icons}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
};

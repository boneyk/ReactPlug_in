import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Grid2 } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import styles from './WarningMessage.module.scss';
import { useStores } from '@/stores/useStores';

const WarningMessage = observer(() => {
  const { baseLayoutStore } = useStores();
  const { warningMessage, isWarningVisible } = baseLayoutStore;

  return (
    <Grid2 container className={classNames(styles.wrapper, { [styles.hidden]: !isWarningVisible })}>
      <Grid2 container className={styles.warningMessage}>
        <ErrorOutlineIcon />
        <span>{warningMessage}</span>
      </Grid2>
    </Grid2>
  );
});

export default WarningMessage;

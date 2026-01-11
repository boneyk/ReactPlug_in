import { FC, useState } from 'react';

import { Button } from '@mui/material';
import arrowBack from 'assets/move-back-arrow.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { monthList } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';
import Modal from '../Modals/ModalCreate/ModalCreate';

import styles from './TimetableDate.module.scss';

interface TimetableDateProps {
  className?: string;
}

const TimetableDate: FC<TimetableDateProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const curDate = new Date();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className={classNames(className, styles['timetable__header-date'])}>
      <div className={styles['leftBlock']}>
        <h1 className={styles['day-month']}>
          {curDate.getDate()} {monthList[curDate.getMonth()]}
        </h1>
        <h1 className={styles['year']}>{timetableStore.year}</h1>

        <button
          className={classNames(styles['timetable__header-button'], 'decrease')}
          onClick={() => timetableStore.decYear()}
          type="button"
        >
          <img src={arrowBack} alt="-" />
        </button>

        <button
          className={classNames(styles['timetable__header-button'], 'increase')}
          onClick={() => timetableStore.incYear()}
          type="button"
        >
          <img src={arrowForward} alt="+" />
        </button>
      </div>
      {localStorage.getItem("authorities") === 'ROLE_ADMIN' && (
        <Button className={styles.create_btn} onClick={() => setIsOpen(true)}>
          Создать смену
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
});

export default TimetableDate;

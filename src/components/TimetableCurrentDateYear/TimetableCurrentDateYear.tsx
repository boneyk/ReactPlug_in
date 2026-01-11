import { FC, useState } from 'react';

import { Button, Grid2 } from '@mui/material';
import { logout } from 'api/auth_service';
import arrowBack from 'assets/move-back-arrow.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import classNames from 'classnames';
import { LoginDTO } from 'dto/DtoAuthService';
import { observer } from 'mobx-react-lite';

import { monthList } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';
import Modal from '../Modals/ModalCreate/ModalCreate';

import styles from './TimetableCurrentDateYear.module.scss';

interface TimetableCurrentDateYearProps {
  className?: string;
}

const TimetableCurrentDateYear: FC<TimetableCurrentDateYearProps> = observer(({ className }) => {
  const { timetableStore } = useStores();
  const curDate = new Date();

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleRequestGetShifts = async () => {
    try {
      timetableStore.loadShifts(timetableStore.year, timetableStore.month + 1);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        console.log(err.response.data.detail);
      }
    }
  };

  const handleRequestLogOut = async () => {
    try {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        console.error('Нет данных для выхода');
        return;
      }

      const dto: LoginDTO = { username, password };
      await logout(dto);
      localStorage.clear();

      window.location.href = '/login';
    } catch (err: any) {
      if (err.response?.data?.detail) {
        console.log(err.response.data.detail);
      }
    }
  };
  return (
    <Grid2
      container
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0 16px'
      }}
    >
      <div className={classNames(className, styles['timetable__header-date'])}>
        <h1 className={styles['day-month']}>
          {curDate.getDate()} {monthList[curDate.getMonth()]}
        </h1>

        <h1 className={styles['year']}>{timetableStore.year}</h1>

        <button
          className={classNames(styles['timetable__header-button'], 'decrease')}
          onClick={() => {
            timetableStore.decYear();
            handleRequestGetShifts();
          }}
          type="button"
        >
          <img src={arrowBack} alt="-" />
        </button>

        <button
          className={classNames(styles['timetable__header-button'], 'increase')}
          onClick={() => {
            timetableStore.incYear();
            handleRequestGetShifts();
          }}
          type="button"
        >
          <img src={arrowForward} alt="+" />
        </button>
      </div>

      <div className={classNames(styles['tools'])}>
        {localStorage.getItem('authorities') === 'ROLE_ADMIN' && (
          <Button className={styles['create_btn']} onClick={() => setIsOpen(true)}>
            {'Создать смену'}
          </Button>
        )}
        <Button className={styles['create_btn']} onClick={() => handleRequestLogOut()}>
          {'Выйти'}
        </Button>
        <Modal isOpen={isOpen} onClose={handleClose} />
      </div>
    </Grid2>
  );
});

export default TimetableCurrentDateYear;

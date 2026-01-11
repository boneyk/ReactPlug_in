import { FC, useEffect, useState } from 'react';

import arrowBackDis from 'assets/move-back-arrow-disabled.svg';
import arrowBack from 'assets/move-back-arrow.svg';
import arrowForwardDis from 'assets/move-forward-arrow-disabled.svg';
import arrowForward from 'assets/move-forward-arrow.svg';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { stepPx } from '../../constants/timetable';

import { useStores } from '../../stores/useStores';

import styles from './TimetableControls.module.scss';

interface TimetableControlsProps {
  className?: string;
}

const TimetableControls: FC<TimetableControlsProps> = observer(({ className }) => {
  const { timetableStore } = useStores();

  const [leftDis, setLeftDis] = useState(true);
  const [rightDis, setRightDis] = useState<boolean>(false);

  useEffect(() => {
    setLeftDis(timetableStore.calendarTranslatePx === 0);
    setRightDis(timetableStore.calendarTranslatePx >= timetableStore.calendarMaxTranslatePx);
  }, [timetableStore.calendarTranslatePx, timetableStore.calendarMaxTranslatePx]);

  return (
    <div className={classNames(styles['timetable-footer'], className)}>
      <div className={classNames(styles['workers-control-buttons'])}></div>
      <div className={classNames(styles['timetable-control-buttons'])}>
        <button
          className={styles['move-button']}
          onClick={() => timetableStore.moveCalendarLeft(stepPx)}
          disabled={leftDis}
        >
          <img src={leftDis ? arrowBackDis : arrowBack} alt="назад" />
        </button>

        <button
          className={styles['move-button']}
          onClick={() => timetableStore.moveCalendarRight(stepPx)}
          disabled={rightDis}
        >
          <img src={rightDis ? arrowForwardDis : arrowForward} alt="вперёд" />
        </button>
      </div>
    </div>
  );
});

export default TimetableControls;

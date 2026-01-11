import { FC } from 'react';

import classNames from 'classnames';

import TimetableModalView from 'components/Modals/ModalView/ModalView';

import { CELL_W } from '../../constants/timetable';
import { ShiftBlock } from '../../utils/functions';

import { Worker } from '../../stores/timetable.store';
import { useStores } from '../../stores/useStores';
import { useViewModal } from '../Modals/ModalView/useViewModal';

import styles from './TimetableGridWorkerRow.module.scss';

interface TimetableWorkerRowProps {
  workerId: string;
  worker: Worker;
  blocksByStart: Map<number, ShiftBlock[]>;
  job: string;
  workerData: Worker;
}

const TimetableGridWorkerRow: FC<TimetableWorkerRowProps> = ({ workerId, worker, blocksByStart, job, workerData }) => {
  const { timetableStore } = useStores();

  const { isOpen, selectedShift, openShiftModal, closeModal } = useViewModal();

  return (
    <div className={styles['worker-row']}>
      {timetableStore.days.map((dayIndex) => {
        const startBlocks = blocksByStart.get(dayIndex) ?? [];
        const hasStart = startBlocks.length > 0;

        return (
          <div
            key={`${workerId}-${dayIndex}`}
            className={classNames(styles['cell'], styles['worker-cell'], {
              [styles['worker-cell--has-start']]: hasStart
            })}
          >
            <div className={styles['worker-cell-content']}>
              {startBlocks.map((block) => (
                <div
                  key={`${workerId}-${block.id}`}
                  className={classNames(styles['shift'], styles[`shift--${block.type}`])}
                  style={{
                    width: `calc(${block.spanDays} * ${CELL_W}px - 8px)`
                  }}
                  title={`${worker.fullName}: ${block.text}`}
                  onClick={() => {
                    openShiftModal({
                      id: block.id,
                      fullname: workerData.fullName,
                      job,
                      dayIndex,
                      type: block.type,
                      text: block.text,
                      spanDays: block.spanDays
                    });
                  }}
                >
                  {block.text}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <TimetableModalView isOpen={isOpen} onClose={closeModal} shiftData={selectedShift} />
    </div>
  );
};

export default TimetableGridWorkerRow;

import { Grid2, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import { modalCreateStore, ShiftPreset } from 'stores/modalCreate.store';

import { OfficeScheduleHint } from '@/components/OfficeScheduleHint/OfficeScheduleHint';

import styles from '../ModalCreate/ModalCreate.module.scss';

export const ModalCreatePressets = observer(() => {
  const changePresset = (_: unknown, newId: number | null) => {
    modalCreateStore.selectPreset(newId);
  };
  return (
    <Grid2 container className={styles.containerHeader}>
      <Grid2 className={styles.sectionName}>
        <DateRangeIcon />
        <Typography>Период работы</Typography>
        <OfficeScheduleHint></OfficeScheduleHint>
      </Grid2>
      <ToggleButtonGroup
        value={modalCreateStore.selectedPresetId}
        exclusive
        onChange={changePresset}
        className={styles.toggleWrapper}
      >
        {modalCreateStore.presets.map((preset: ShiftPreset) => (
          <ToggleButton key={preset.id} value={preset.id} className={styles.timeButton}>
            {preset.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid2>
  );
});

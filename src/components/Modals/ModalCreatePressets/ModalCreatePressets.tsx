import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { DateRangeIcon } from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import { timetableCreateStore } from 'stores/modalCreate.store';

import styles from '../ModalCreate/ModalCreate.module.scss';

export const Pressets = observer(() => {
  return (
    <Stack direction="row" spacing={1} className={styles.container}>
      <DateRangeIcon />
      <Typography>Период работы</Typography>
      <ToggleButtonGroup
        value={timetableCreateStore.selectedPresetId}
        exclusive
        onChange={(_, newId) => timetableCreateStore.selectPreset(newId)}
      >
        {timetableCreateStore.presets.map((preset) => (
          <ToggleButton key={preset.id} value={preset.id}>
            {preset.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
});

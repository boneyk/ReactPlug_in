import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { templateTheme } from 'styles';

import './index.css';
import Navigation from './navigation/Navigation';

dayjs.locale('ru');

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider theme={templateTheme}>
    <CssBaseline />
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  </ThemeProvider>
);

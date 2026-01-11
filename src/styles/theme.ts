import { createTheme } from '@mui/material/styles';

import { getNumberValue } from './utils';

import vars from './variables.module.scss';

export const theme = createTheme({
  palette: {
    primary: {
      main: vars.colorPrimary,
      light: vars.colorPrimaryLight,
      dark: vars.colorPrimaryDark,
      contrastText: vars.colorContrast
    },
    secondary: {
      main: vars.colorSecondaryMain,
      light: vars.colorSecondaryLight,
      dark: vars.colorSecondaryDark,
      contrastText: vars.colorContrast
    },
    error: {
      main: vars.colorError
    },
    success: {
      main: vars.colorSuccess
    },
    warning: {
      main: vars.colorWarning
    }
  },
  typography: {
    fontFamily: vars.fontPrimary,
    fontWeightRegular: vars.fontWeightRegular,
    fontWeightMedium: vars.fontWeightMedium,
    fontWeightBold: vars.fontWeightBold
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: getNumberValue(vars.marginXS)
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontFamily: vars.fontFamily,
          fontWeight: vars.fontWeightRegular,
          fontSize: vars.fontSize,
          padding: '8px 16px',
          backgroundColor: vars.colorSecondaryLight,
          color: vars.colorWhite,
          border: 'none',
          '&:hover': {
            backgroundColor: vars.colorSecondaryMain
          }
        }
      }
    }
  }
});

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
          textTransform: 'none',
          fontFamily: vars.fontFamily,
          fontWeight: vars.fontWeightRegular,
          padding: '8px 16px',
          backgroundColor: vars.colorSecondaryLight,
          color: vars.colorWhite,
          border: 'none',
          minHeight: 0,
          minWidth: 0,
          '&:hover': {
            backgroundColor: vars.colorSecondaryMain
          },
          '&.Mui-focusVisible': {
            outline: `2px dashed ${vars.colorWhite}`,
            outlineOffset: 2
          },

          '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none'
          }
        },

        contained: {
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: 'var(--font-family-base), sans-serif',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color var(--transition-base), color var(--transition-base)',
          boxShadow: 'none',
          boxSizing: 'border-box'
        },
        containedPrimary: {
          color: 'var(--color-white)',
          backgroundColor: vars.colorSecondaryLight,
          '&:hover': {
            backgroundColor: vars.colorSecondaryMain,
            boxShadow: 'none'
          }
        },
        containedSecondary: {
          color: 'var(--color-black)',
          backgroundColor: vars.colorNeutral,
          '&:hover': {
            backgroundColor: vars.colorHoverNeutral,
            boxShadow: 'none'
          }
        },

        outlined: {
          backgroundColor: 'var(--color-white)',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontSize: vars.monthSwitcherFontSize,
          fontWeight: 'bold',
          fontFamily: 'var(--font-family-base), sans-serif',
          transition:
            'border-color var(--transition-base), color var(--transition-base), background-color var(--transition-base)'
        },
        outlinedPrimary: {
          border: 'solid var(--color-pointer) var(--border-width-thin)',
          '&:hover': {
            backgroundColor: 'var(--color-white)',
            borderColor: vars.colorSecondaryMain,
            boxShadow: 'none'
          }
        },
        outlinedSecondary: {
          border: 'solid var(--color-gray-400) var(--border-width-thin)',
          '&:hover': {
            backgroundColor: 'var(--color-gray-100)',
            borderColor: vars.colorHoverNeutral,
            boxShadow: 'none'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          boxSizing: 'border-box',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: vars.colorHoverNeutral
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: vars.colorSecondaryLight
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: vars.colorSecondaryLight,
            borderWidth: 2
          },

          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-error)'
          },

          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: vars.colorHoverNeutral,

          '.Mui-focused &': {
            color: vars.colorSecondaryLight
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family-base), sans-serif',

          color: vars.colorHoverNeutral,
          fontSize: 14,
          fontWeight: 600,

          '&.Mui-focused': {
            color: vars.colorSecondaryLight
          },

          '&.Mui-error': {
            color: vars.colorError
          },

          '&.Mui-disabled': {
            color: 'rgba(0,0,0,0.38)'
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family-base), sans-serif',

          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 115, 50, 0.2)',
            fontWeight: 600
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255, 115, 50, 0.2)',
            fontWeight: 600
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'rgba(255, 115, 50, 0.2)'
          },
          '&.Mui-selected.Mui-focusVisible': {
            backgroundColor: 'rgba(255, 115, 50, 0.2)'
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          maxHeight: 300,
          overflowY: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        },
        list: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          tableLayout: 'fixed',
          width: '100%'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-family-base), sans-serif',
          boxSizing: 'border-box',
          borderBottom: 'solid 1px var(--color-neutral-60)',
          borderRight: 'solid 1px var(--color-neutral-60)',
          padding: 0
        },

        head: {
          fontWeight: 600
        },

        stickyHeader: {
          zIndex: 6,
          backgroundColor: 'var(--color-white)'
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: vars.monthSwitcherBorderRadius,
          border: 'solid 1px var(--color-neutral-60)',
          boxSizing: 'border-box'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: 'var(--color-pointer)'
        }
      }
    }
  }
});

import { createTheme } from '@mui/material/styles';

// Helper function to get typography styles
const getTypographyStyles = (variant) => ({
  fontFamily: `var(--text-${variant}-font-family)`,
  fontSize: `var(--text-${variant}-font-size)`,
  fontWeight: `var(--text-${variant}-font-weight)`,
  letterSpacing: `var(--text-${variant}-letter-spacing)`,
});

const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans", sans-serif',
    // Override specific variants
    body1: {
      fontFamily: '"Noto Sans", sans-serif',
    },
    body2: {
      fontFamily: '"Noto Sans", sans-serif',
    }
  },
  components: {
    // ADD TABS STYLING
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--color-primary)',
            height: '3px', // Changed from 2px to 4px
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: '60px', // Match your container height
          color: 'var(--color-on-surface-variant)',
          paddingBottom: '0px', // Reduce bottom padding to bring text closer to indicator
          ...getTypographyStyles('label-medium-large'), // Default state
          '&.Mui-selected': {
            color: 'var(--color-primary)',
            ...getTypographyStyles('label-bold-large'), // Active state
          },
          '&:hover': {
            color: 'var(--color-on-surface)',
            backgroundColor: 'var(--state-layer-primary-008)',
          },
          // Remove default focus styles and add custom ones
          '&:focus-visible': {
            backgroundColor: 'var(--state-layer-primary-012)',
            outline: 'none',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: 'var(--text-label-large-font-family)',
          fontSize: 'var(--text-label-large-font-size)',
          fontWeight: 'var(--text-label-large-font-weight)',
          letterSpacing: 'var(--text-label-large-letter-spacing)',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '6px',
          padding: '4px 8px'
        },
        arrow: {
          color: 'var(--color-primary)' // Arrow matches tooltip background
        }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: '25px',
            textTransform: 'none',
            padding: '12px 24px',
            height: '48px',
            border: 'none',
            ...getTypographyStyles('label-bold-large'),
            '&:hover': {
              backgroundColor: 'var(--color-composite-primary3-neutral100-008)',
              color: 'var(--color-on-primary)',
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-primary)',
              outlineOffset: '2px',
              backgroundColor: 'var(--color-composite-primary3-neutral100-008)',
            },
            '&:disabled': {
              backgroundColor: 'var(--state-layer-on-surface-012)',
              color: 'var(--color-outline)',
              border: 'none',
            }
          }
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: 'var(--color-outline-variant)',
            color: 'var(--color-on-surface)',
            borderRadius: '25px',
            textTransform: 'none',
            padding: '12px 24px',
            height: '48px',
            backgroundColor: 'transparent',
            ...getTypographyStyles('label-large'),
            '&:hover': {
              borderColor: 'var(--color-outline-variant)',
              backgroundColor: 'var(--state-layer-primary-008)',
              color: 'var(--color-on-surface)',
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-primary)',
              outlineOffset: '2px',
              backgroundColor: 'var(--state-layer-primary-008)',
            },
            '&:disabled': {
              borderColor: 'var(--state-layer-on-surface-012)',
              color: 'var(--color-outline)',
              backgroundColor: 'transparent',
            }
          }
        },
        {
          props: { variant: 'tonal' },
          style: {
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            borderRadius: '25px',
            textTransform: 'none',
            padding: '12px 24px',
            height: '48px',
            border: 'none',
            ...getTypographyStyles('label-large'),
            '&:hover': {
              backgroundColor: 'var(--color-composite-secondary90-neutral10-008)',
              color: 'var(--color-on-secondary-container)',
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-secondary)',
              outlineOffset: '2px',
              backgroundColor: 'var(--color-composite-secondary90-neutral10-008)',
            },
            '&:disabled': {
              backgroundColor: 'var(--state-layer-on-surface-012)',
              color: 'var(--color-outline)',
              border: 'none',
            }
          }
        },
        {
          props: { variant: 'textbutton' },
          style: {
            color: 'var(--color-on-surface)',
            borderRadius: '25px',
            textTransform: 'none',
            padding: '12px 24px',
            height: '48px',
            backgroundColor: 'transparent',
            border: 'none', // No outline like outlined button
            ...getTypographyStyles('label-large'),
            '&:hover': {
              backgroundColor: 'var(--state-layer-primary-008)',
              color: 'var(--color-on-surface)',
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-primary)',
              outlineOffset: '2px',
              backgroundColor: 'var(--state-layer-primary-008)',
            },
            '&:disabled': {
              color: 'var(--color-outline)',
              backgroundColor: 'transparent',
            }
          }
        }
      ]
    },

    // TextField styling with enhanced focus and disabled states
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Default focus state
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary) !important',
            borderWidth: '2px',
          },
          // Error focus state - override primary with error color
          '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-error) !important',
            borderWidth: '2px',
          },
          // Disabled state
          '&.Mui-disabled': {
            backgroundColor: 'var(--state-layer-on-surface-008)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-outline-variant)',
            },
            '& input': {
              color: 'var(--color-outline)',
              WebkitTextFillColor: 'var(--color-outline)',
            }
          }
        },
      },
    },

    // Enhanced Input Label with disabled state
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // Default focus state
          '&.Mui-focused': {
            color: 'var(--color-primary) !important',
          },
          // Error focus state
          '&.Mui-focused.Mui-error': {
            color: 'var(--color-error) !important',
          },
          // Disabled state
          '&.Mui-disabled': {
            color: 'var(--color-outline) !important',
          }
        },
      },
    },

    // Enhanced FormControl for Select with disabled states
    MuiFormControl: {
      styleOverrides: {
        root: {
          // Error state for Select components
          '&.Mui-error .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-error) !important',
            borderWidth: '2px',
          },
          '&.Mui-error .MuiInputLabel-root.Mui-focused': {
            color: 'var(--color-error) !important',
          },
        },
      },
    },

    // Enhanced Select component with disabled state
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: 'var(--state-layer-on-surface-008)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-outline-variant)',
            },
            '& .MuiSelect-select': {
              color: 'var(--color-outline)',
              WebkitTextFillColor: 'var(--color-outline)',
            }
          }
        }
      }
    },

    // Enhanced MenuItem with focus-visible
    MuiMenuItem: {
      styleOverrides: {
        root: {
          // Regular hover state
          '&:hover': {
            backgroundColor: 'var(--color-composite-neutral99-primary10-008) !important',
          },
          // Focus-visible state for keyboard navigation
          '&:focus-visible': {
            backgroundColor: 'var(--color-composite-neutral99-primary10-012) !important',
            outline: 'none',
          },
          // Selected state
          '&.Mui-selected': {
            backgroundColor: 'var(--color-secondary-container) !important',
            color: 'var(--color-on-secondary-container)',
            // Selected hover state
            '&:hover': {
              backgroundColor: 'var(--color-composite-secondary90-neutral10-008) !important',
            },
            // Selected focus-visible state
            '&:focus-visible': {
              backgroundColor: 'var(--color-composite-secondary90-neutral10-012) !important',
              outline: 'none',
            },
          },
          // Disabled state
          '&.Mui-disabled': {
            color: 'var(--color-outline)',
            backgroundColor: 'transparent',
          },
          // Custom ripple color
          '& .MuiTouchRipple-root': {
            color: 'var(--color-outline)',
          }
        },
      },
    },

    // Existing Menu styles
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-outline-variant)',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }
});

export default theme;
// src/theme.js

import { createTheme } from '@mui/material/styles';
import { green, pink } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: green[700],
        },
        secondary: {
            main: pink[500],
        },
        background: {
            default: '#F4F4F9',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;

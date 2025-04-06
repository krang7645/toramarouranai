import { createTheme } from '@mui/material/styles';

// カラーパレットの定義
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c1810', // メインカラー（濃い茶色）
      light: '#4a2c1c', // 明るい茶色
      dark: '#1a0f0a', // 暗い茶色
    },
    secondary: {
      main: '#8B4513', // セカンダリーカラー（サドルブラウン）
      light: '#A0522D',
      dark: '#6B3811',
    },
    background: {
      default: '#f5f5f5', // 背景色（薄いグレー）
      paper: '#ffffff', // カード背景（白）
    },
    text: {
      primary: '#2c1810', // メインテキスト（濃い茶色）
      secondary: '#666666', // セカンダリーテキスト（グレー）
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          textTransform: 'none',
        },
        contained: {
          background: 'linear-gradient(45deg, #2c1810 30%, #1a0f0a 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1a0f0a 30%, #2c1810 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

export default theme;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Typography, Box } from '@mui/material';
import theme from './theme';
import MBTITest from './components/MBTITest';
import DifyResultScreen from './components/DifyResultScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="fixed" sx={{
          background: 'linear-gradient(45deg, #2c1810 30%, #1a0f0a 90%)',
          boxShadow: '0 3px 5px 2px rgba(44, 24, 16, .3)'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 1
          }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
              トラまろ　取説メーカー
            </Typography>
          </Box>
        </AppBar>
        <Box sx={{ pt: 8 }}> {/* ヘッダーの高さ分のパディング */}
          <Routes>
            <Route path="/mbti-test" element={<MBTITest />} />
            <Route path="/result" element={<DifyResultScreen />} />
            <Route path="*" element={<Navigate to="/mbti-test" replace />} />
          </Routes>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
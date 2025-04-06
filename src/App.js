import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import MBTITest from './components/MBTITest';
import DifyResultScreen from './components/DifyResultScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route path="/mbti-test" element={<MBTITest />} />
          <Route path="/result" element={<DifyResultScreen />} />
          <Route path="*" element={<Navigate to="/mbti-test" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
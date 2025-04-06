import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MBTITest from './components/MBTITest';
import DifyResultScreen from './components/DifyResultScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/mbti-test" element={<MBTITest />} />
          <Route path="/result" element={<DifyResultScreen />} />
          <Route path="*" element={<Navigate to="/mbti-test" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
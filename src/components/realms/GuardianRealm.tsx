import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GuardianDashboard from '../guardian/GuardianDashboard';

const GuardianRealm: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<GuardianDashboard />} />
    </Routes>
  );
};

export default GuardianRealm;
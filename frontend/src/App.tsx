// src/App.tsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/user.routes';
import HomePage from './pages/homepage/homepage';

import GroupRoutes from './routes/group.routes';
const App: React.FC = () => {
  

  // Define condition to exclude the Navbar on the homepage
 

  return (
    <>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/group/*" element={<GroupRoutes/>} />
      </Routes>
    </>
  );
};

const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;

// src/App.tsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UserRoutes from './routes/user.routes';
import HomePage from './pages/homepage/homepage';
import Navbar from './components/navbar/navbar'
import GroupRoutes from './routes/group.routes';
const App: React.FC = () => {
  const location = useLocation();

  // Define condition to exclude the Navbar on the homepage
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
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

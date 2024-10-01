// src/routes/UserRoutes.tsx
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SignUpPage from '../pages/signup/signup';
import LoginPage from '../pages/Login/Login';
import ProfilePage from '../pages/profile/profile';
import CreateTaskPage from '../pages/tasks/personaltasks/createtask';
import TaskList from '../pages/tasks/alltasks/tasks';
import TaskPage from '../pages/tasks/personaltasks/taskpage';
import Navbar from '../components/navbar/navbar';
import AuthRoute from './auth'; // Import the AuthRoute component

const UserRoutes: React.FC = () => {
    const location = useLocation();

    // Hide Navbar on login and signup pages
    const hideNavbar = location.pathname === '/user/login' || location.pathname === '/user/signup';

    return (
        <>
            {!hideNavbar && <Navbar />} {/* Conditionally render the Navbar */}
            <Routes>
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/createtask" element={<AuthRoute element={<CreateTaskPage />} />} />
                <Route path="/taskslist" element={<AuthRoute element={<TaskList />} />} />
                <Route path="/profile" element={<AuthRoute element={<ProfilePage />} />} />
                <Route path="/task/:taskId" element={<AuthRoute element={<TaskPage />} />} />
            </Routes>
        </>
    );
};

export default UserRoutes;

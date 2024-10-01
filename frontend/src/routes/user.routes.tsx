// src/routes/UserRoutes.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUpPage from '../pages/signup/signup';
import LoginPage from '../pages/Login/Login';
import ProfilePage from '../pages/profile/profile';
import CreateTaskPage from '../pages/tasks/personaltasks/createtask';
import TaskList from '../pages/tasks/alltasks/tasks';

const UserRoutes: React.FC = () => {
    return (
        <Routes>
          
            <Route path="/createtask" element={<CreateTaskPage/>} />
          
            <Route path="/taskslist" element={<TaskList/>} />
            <Route path="/signup" element={<SignUpPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/login" element={<LoginPage/>} />
           
            </Routes>
    );
};

export default UserRoutes;

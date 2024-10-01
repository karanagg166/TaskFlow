import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import TaskIcon from '@mui/icons-material/AssignmentTurnedIn';
import axios from 'axios';

const Navbar: FC = () => {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    
    const fetchData = async () => {
      if (storedId) {
        try {
          const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${storedId}/userinfo`);
          setUser(userResponse.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AppBar position="fixed" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
        <Toolbar className="flex justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              alt="Logo"
              src="https://your-logo-url.com/logo.png"
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="h5" className="font-bold text-white">
              My Dashboard
            </Typography>
          </div>

          <div className="space-x-6 flex items-center">
            <Link to="/user/profile" className="text-white font-semibold hover:underline">
              <DashboardIcon className="mr-1" /> Dashboard
            </Link>
            <Link to="/user/createtask" className="text-white font-semibold hover:underline">
              <TaskIcon className="mr-1" /> New Task
            </Link>
            <Link to="/user/taskslist" className="text-white font-semibold hover:underline">
              <TaskIcon className="mr-1" /> Tasks
            </Link>
            <Link to="/group/groups" className="text-white font-semibold hover:underline">
              <GroupIcon className="mr-1" /> Groups
            </Link>
            <Link to="/settings" className="text-white font-semibold hover:underline">
              <SettingsIcon className="mr-1" /> Settings
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <>
                <Typography className="text-white font-semibold">{user.name}</Typography>
                <Avatar alt="User" src={user.avatar || "https://your-profile-pic-url.com/profile.jpg"} />
                <IconButton color="inherit">
                  <LogoutIcon className="text-white" />
                </IconButton>
              </>
            ) : (
              <Typography className="text-white font-semibold">Loading...</Typography>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Adds padding below the navbar */}
    </>
  );
};

export default Navbar;

import { FC, useEffect, useState } from 'react';
import {
  Avatar,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

// User and TaskCount Interfaces
interface User {
  name: string;
  email: string;
  username: string;
  profilePicture: string;
  totalGroups: number;
  adminGroups: number;
  createdGroups: number;
  memberGroups: number;
}

interface TaskCount {
  Completed: {
    total: number;
    Low: number;
    Medium: number;
    High: number;
  };
  Pending: {
    total: number;
    Low: number;
    Medium: number;
    High: number;
  };
  InProgress: {
    total: number;
    Low: number;
    Medium: number;
    High: number;
  };
}

// Default Values
const defaultUser: User = {
  name: '',
  email: '',
  username: '',
  profilePicture: '',
  totalGroups: 0,
  adminGroups: 0,
  createdGroups: 0,
  memberGroups: 0,
};

const defaultTaskCount: TaskCount = {
  Completed: {
    total: 0,
    Low: 0,
    Medium: 0,
    High: 0,
  },
  Pending: {
    total: 0,
    Low: 0,
    Medium: 0,
    High: 0,
  },
  InProgress: {
    total: 0,
    Low: 0,
    Medium: 0,
    High: 0,
  },
};

// ProfilePage Component
const ProfilePage: FC = () => {
  const [user, setUser] = useState<User>(defaultUser);
  const [taskCounts, setTaskCounts] = useState<TaskCount>(defaultTaskCount);
  const [loading, setLoading] = useState(true);
  let id = null;

  // Safely retrieve and parse the localStorage item
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('id');
   
    id = storedData;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}/userinfo`);
        const tasksResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${id}/taskcount`);

        setUser(userResponse.data.user);
       
        setTaskCounts(tasksResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Include id in the dependency array to avoid stale closures

  if (loading) {
    return (
      <Container maxWidth="md" className="mt-10 text-center">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* User Profile Section */}
      <Container maxWidth="md" className="mt-10">
        <Paper elevation={3} className="p-6 rounded-lg shadow-lg bg-white mb-8">
          <div className="flex items-center mb-4">
            <Avatar
              alt={user.name}
              src={user.profilePicture}
              sx={{ width: 120, height: 120 }}
              className="shadow-lg"
            />
            <div className="ml-6">
              <Typography variant="h4" className="font-bold text-indigo-800">
                {user.name || 'John Doe'}
              </Typography>
              <Typography variant="body1" color="textSecondary" className="italic">
                {user.email || 'example@example.com'}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                @{user.username || 'username'}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                {user.totalGroups} Groups | {user.adminGroups} Admin | {user.createdGroups} Created
              </Typography>
            </div>
          </div>
        </Paper>

        {/* Group Information Section */}
        <Typography variant="h5" className="mb-4 font-bold text-center text-gray-700">
          Group Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-blue-50">
              <Typography variant="h6" className="font-semibold text-indigo-700">Total Groups</Typography>
              <Typography variant="h3" className="font-bold text-indigo-600">
                {user.totalGroups || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-green-50">
              <Typography variant="h6" className="font-semibold text-green-700">Admin Groups</Typography>
              <Typography variant="h3" className="font-bold text-green-600">
                {user.adminGroups || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-yellow-50">
              <Typography variant="h6" className="font-semibold text-yellow-700">Created Groups</Typography>
              <Typography variant="h3" className="font-bold text-yellow-600">
                {user.createdGroups || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Task Overview Section */}
        <Typography variant="h5" className="mt-8 mb-4 font-bold text-center text-gray-700">
          Task Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-green-100">
              <Typography variant="h6" className="font-semibold text-green-700">Completed Tasks</Typography>
              <Typography variant="h3" className="font-bold text-green-800">
                {taskCounts.Completed?.total || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Low: {taskCounts.Completed?.Low || 0}, Medium: {taskCounts.Completed?.Medium || 0}, High: {taskCounts.Completed?.High || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-yellow-100">
              <Typography variant="h6" className="font-semibold text-yellow-700">Pending Tasks</Typography>
              <Typography variant="h3" className="font-bold text-yellow-800">
                {taskCounts.Pending?.total || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Low: {taskCounts.Pending?.Low || 0}, Medium: {taskCounts.Pending?.Medium || 0}, High: {taskCounts.Pending?.High || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 rounded-lg shadow-md bg-blue-100">
              <Typography variant="h6" className="font-semibold text-blue-700">In Progress Tasks</Typography>
              <Typography variant="h3" className="font-bold text-blue-800">
                {taskCounts.InProgress?.total || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Low: {taskCounts.InProgress?.Low || 0}, Medium: {taskCounts.InProgress?.Medium || 0}, High: {taskCounts.InProgress?.High || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ProfilePage;

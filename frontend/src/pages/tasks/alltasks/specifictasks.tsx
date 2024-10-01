import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TextField, MenuItem, Button } from '@mui/material';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaFilter } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

export interface Task {
    _id: string; // Task ID
    title: string;
    description?: string; // Optional field
    dueDate?: Date; // Optional field
    status: 'Pending' | 'InProgress' | 'Completed';
    assignedUser: string; // User ID (string)
    priority: 'Low' | 'Medium' | 'High';
    createdBy: string; // User ID (string)
    group?: string; // Group ID (optional)
    createdAt: string; // Timestamps
    updatedAt: string; // Timestamps
  }
  interface TaskFilterProps {
    onFilteredTasks: (tasks: Task[]) => void; // Define the type for the props
  }
  const TaskFilter: React.FC<TaskFilterProps> = ({ onFilteredTasks }) => {
  const [status, setStatus] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(null);
  const [createTaskDate, setCreateTaskDate] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleFilter = async () => {
    const id = localStorage.getItem('id');
    const filterData = {
      status,
      groupName, // You can keep groupId or groupName based on your need
      dueDate: dueDate ? dueDate.format('YYYY-MM-DD') : null, // Format the date if available
      priority,
      createTaskDate,
      assignedBy,
    };

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${id}/specifictasks`, {
        params: filterData, // Pass the filter data as query parameters
      });
 setTasks(response.data.tasks);
      console.log(tasks);
      setTasks(response.data.tasks);
      console.log(response.data.tasks); 
      onFilteredTasks(response.data.tasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 pt-40 px-4" style={{ paddingTop: '180px', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full mx-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Filter Your Tasks</h1>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="grid grid-cols-1 gap-6"
        >
          {/* Status Filter */}
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full"
            variant="outlined"
            color="primary"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          {/* Group ID Filter */}
          <TextField
            select
            label="Group ID"
            value={groupId}
            onChange={(e) => {
              setGroupId(e.target.value);
              setGroupName(''); // Reset group name when group ID changes
            }}
            variant="outlined"
            className="w-full"
            color="primary"
          >
            <MenuItem value="personal">Personal Tasks</MenuItem>
            <MenuItem value="team">Team Tasks</MenuItem>
          </TextField>

          {/* Conditionally Render Group Name Field */}
          {groupId === 'team' && (
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              variant="outlined"
              className="w-full"
              color="primary"
            />
          )}

          {/* Assigned By Filter */}
          <TextField
            label="Assigned By"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            variant="outlined"
            className="w-full"
            color="primary"
          />

          {/* Due Date Filter */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slots={{ textField: TextField }}  // Specify the TextField slot
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />
          </LocalizationProvider>

          {/* Create Task Date Filter */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Create Task Date"
              value={createTaskDate}
              onChange={(newValue) => setCreateTaskDate(newValue)}
              slots={{ textField: TextField }}  // Specify the TextField slot
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  margin: 'normal',
                  required: true,
                },
              }}
            />
          </LocalizationProvider>

          {/* Priority Filter */}
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full"
            variant="outlined"
            color="primary"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>

          {/* Filter Button */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<FaFilter />}
              onClick={handleFilter}
              className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-800"
            >
              Filter Tasks
            </Button>
          </motion.div>

          {/* Reset Button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<AiOutlineSearch />}
            onClick={() => {
              setStatus('');
              setGroupId('');
              setGroupName('');
              setDueDate(null);
              setCreateTaskDate(null);
              setPriority('');
              setAssignedBy('');
            }}
            className="mt-2"
          >
            Reset Filters
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskFilter;

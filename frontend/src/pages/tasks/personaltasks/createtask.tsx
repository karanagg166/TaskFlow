import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CreateTaskPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<string>('Medium'); // Default priority
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
   
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('id');
     setUserId(storedData);
    }


  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for required fields
    if (!title || !description || !dueDate || !priority) {
      setErrorMessage('All fields are required.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/createtask`, {
        title,
        description,
        dueDate: dueDate ? dueDate.toISOString() : null,
        status: 'Pending',
        priority,
        createdBy:userId,
        assignedUser: userId,
      });

      setSuccessMessage(`Task created successfully: ${response.data.title}`);
      clearForm();
      setOpenSnackbar(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message || 'Error creating task. Please try again.');
      } else {
        setErrorMessage('Error creating task. Please try again.');
      }
      setOpenSnackbar(true);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('Medium'); // Reset to default priority
  };

  return (
    <div className="container mx-auto p-5">
      <Typography variant="h4" className="text-center mb-5 text-gray-700">
        Create a Task for Yourself
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          <TextField
            label="Task Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slots={{ textField: TextField }}  // Specify the TextField slot
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                margin: "normal",
                required: true,
              },
            }}
            minDate={dayjs().add(1, 'day')} // Prevent past date selection
          />
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            margin="normal"
            value="To Do"
            disabled
          />
          <Button type="submit" variant="contained" color="primary" className="w-full mt-4">
            Create Task
          </Button>
        </form>
      </LocalizationProvider>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMessage ? 'error' : 'success'}>
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateTaskPage;

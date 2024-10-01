import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

export interface Task {
  _id: any;
  title: string;
  description: string;
  assignedTo: string;
  dueDate?: string;
  status?: string;
  createdBy: string;
  priority?: string;
}

interface TaskFilterProps {
  onFilteredTasks: (tasks: Task[]) => void; // Callback to send filtered tasks to GroupPage
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilteredTasks }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  const handleFilter = async () => {
    const id = localStorage.getItem("id");
    const filterData = {
      status: selectedStatus,
      taskTitle,
      dueDate: dueDate ? dueDate.format("YYYY-MM-DD") : null,
      priority,
      assignedTo,
    };

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${id}/specifictasks`,
        {
          params: filterData,
        }
      );

      if (response.data && response.data.tasks) {
        onFilteredTasks(response.data.tasks); // Pass filtered tasks to parent
      } else {
        onFilteredTasks([]); // No tasks returned, clear task list
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      onFilteredTasks([]); // Clear tasks in case of error
    }
  };

  const handleReset = () => {
    setSelectedStatus("");
    setTaskTitle("");
    setDueDate(null);
    setPriority("");
    setAssignedTo("");
    onFilteredTasks([]); // Reset tasks in the parent component
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 pt-40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full mx-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Filter Your Tasks
        </h1>

        <motion.div className="grid grid-cols-1 gap-6">
          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as string)}
              variant="outlined"
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="InProgress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Task Title Filter */}
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            variant="outlined"
            className="w-full"
            color="primary"
          />

          {/* Assigned To Filter */}
          <TextField
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
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
              slots={{ textField: TextField }} // Correct way to pass the custom input field
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
          </LocalizationProvider>

          {/* Priority Filter */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as string)}
              variant="outlined"
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

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
            onClick={handleReset}
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

import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Define the Task interface
interface Task {
  _id: any; // Change id to _id to match backend
  title: string; // Updated to match backend property
  status: string; // This can be "completed" | "pending" | "overdue"
  description: string;
  dueDate: string;
  priority: string; // New field for priority
  assignedBy: { name: string }; // Assuming assignedBy is an object with name property
  createdBy: { name: string }; // Assuming createdBy is an object with name property
  group: { name: string }; // Assuming group is an object with name property
}

const TaskSummaryReport = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const id = localStorage.getItem("id") || "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [assignedByFilter, setAssignedByFilter] = useState<string>("");
  const [dueDateFilter, setDueDateFilter] = useState<dayjs.Dayjs | null>(null);
  const [createTaskDateFilter, setCreateTaskDateFilter] =
    useState<dayjs.Dayjs | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/${id}/report`,
        {
          params: {
            status: statusFilter,
            priority: priorityFilter,
            assignedBy: assignedByFilter,
            dueDate: dueDateFilter ? dueDateFilter.format("YYYY-MM-DD") : null,
            createTaskDate: createTaskDateFilter
              ? createTaskDateFilter.format("YYYY-MM-DD")
              : null,
          },
        }
      );
      setTasks(response.data.tasks); // Ensure this matches your backend response structure
    } catch (err) {
      console.error(err);
      setError("Failed to fetch task summary report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter,
    assignedByFilter,
    dueDateFilter,
    createTaskDateFilter,]);

  const handleDownload = () => {
    const csvContent = [
      [
        "ID",
        "Title",
        "Status",
        "Description",
        "Due Date",
        "Priority",
        "Assigned By",
        "Created By",
        "Group",
      ], // CSV header
      ...tasks.map((task) => [
        task._id, // Changed to _id to match task property
        task.title, // Changed to title to match task property
        task.status,
        task.description,
        task.dueDate,
        task.priority,
        task.assignedBy?.name || "N/A", // Ensure this matches the structure
        task.createdBy?.name || "N/A", // Ensure this matches the structure
        task.group?.name || "N/A", // Ensure this matches the structure
      ]),
    ]
      .map((row) => row.join(",")) // Join each row with commas
      .join("\n"); // Join rows with new lines

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "task_summary_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-800 p-4">
      <motion.h1
        className="text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Task Summary Report
      </motion.h1>

      <motion.div
        className="flex space-x-4 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          variant="outlined"
          className="bg-white text-black"
          displayEmpty
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          variant="outlined"
          className="bg-white text-black"
          displayEmpty
        >
          <MenuItem value="">All Priorities</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>

        <TextField
          label="Assigned By"
          value={assignedByFilter}
          onChange={(e) => setAssignedByFilter(e.target.value)}
          variant="outlined"
          className="bg-white text-black"
        />
      </motion.div>

      <Box className="flex space-x-4 mb-4 p-4 bg-white rounded-lg shadow-md">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDateFilter}
            onChange={(newValue) => setDueDateFilter(newValue)}
            className="bg-white text-black"
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Created Date"
            value={createTaskDateFilter}
            onChange={(newValue) => setCreateTaskDateFilter(newValue)}
            className="bg-white text-black"
          />
        </LocalizationProvider>
      </Box>

      {loading ? (
        <CircularProgress color="inherit" />
      ) : error ? (
        <Typography variant="body1" className="text-red-500 mb-4">
          {error}
        </Typography>
      ) : (
        <motion.ul
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {tasks.map((task) => (
            <li key={task._id} className="py-2 border-b last:border-b-0">
              <Typography variant="body1" className="text-gray-800">
                {task.title} - {task.status} - Due: {task.dueDate} - Priority:{" "}
                {task.priority} - Assigned By: {task.assignedBy?.name || "N/A"}{" "}
                - Created By: {task.createdBy?.name || "N/A"} - Group:{" "}
                {task.group?.name || "N/A"}
              </Typography>
            </li>
          ))}
        </motion.ul>
      )}

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-400 to-green-600"
        >
          Download Report
        </Button>
      </motion.div>
    </div>
  );
};

export default TaskSummaryReport;

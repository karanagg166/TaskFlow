import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "daisyui/dist/full.css";
import TaskFilter from "./specifictasks";

export interface Task {
  _id: any;
  title: string;
  description?: string;
  dueDate?: Date;
  status: "Pending" | "InProgress" | "Completed";
  assignedUser: string;
  priority: "Low" | "Medium" | "High";
  createdBy: string;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

const TaskList: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasksPerPage] = useState<number>(5);

  const handleFilteredTasks = (tasks: Task[]) => {
    setFilteredTasks(tasks);
    setIsFiltering(true);
  };

  const fetchTasks = async () => {
    const id = localStorage.getItem("id");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${id}/alltasks`
      );
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFiltering) {
      fetchTasks();
    }
  }, [isFiltering]);

  useEffect(() => {
    if (filteredTasks.length > 0) {
      setTasks(filteredTasks);
      setIsFiltering(true);
    }
  }, [filteredTasks]);

  const changeStatus = async (
    taskId: string,
    newStatus: "InProgress" | "Pending" | "Completed"
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${taskId}/change_status`,
        { newStatus }
      );
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    const id = localStorage.getItem("id");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/${id}/${taskId}/delete`
      );
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "from-green-300 to-green-500";
      case "Medium":
        return "from-yellow-300 to-yellow-500";
      case "High":
        return "from-red-300 to-red-500";
      default:
        return "from-gray-300 to-gray-500";
    }
  };

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const currentTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  return (
    <div
      className="container mx-auto min-h-screen flex flex-col justify-center"
      style={{ paddingTop: "120px", paddingBottom: "80px" }}
    >
      <TaskFilter onFilteredTasks={handleFilteredTasks} />
      <h1 className="text-5xl font-bold text-center mb-8 text-gray-700">
        Your Tasks
      </h1>
      {loading ? (
        <p className="text-center text-lg">Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTasks.map((task) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="shadow-xl rounded-lg overflow-hidden transform hover:-translate-y-2"
              key={task._id}
            >
              <Link
                to={`/user/task/${task._id}`}
                state={{ task }}
                className="block"
              >
                <Card
                  className={`bg-gradient-to-r ${getPriorityColor(
                    task.priority
                  )} p-6 text-white transition-transform duration-200 ease-in-out hover:scale-105`}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      className="font-extrabold text-2xl"
                    >
                      {task.title}
                    </Typography>
                    <Typography className="mt-2 text-base italic">
                      {task.description || "No description available"}
                    </Typography>
                    <Typography className="mt-2 text-sm">{`Due Date: ${
                      task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"
                    }`}</Typography>
                    <Typography className="mt-2 text-sm">{`Assigned By: ${task.assignedUser}`}</Typography>
                    <Typography className="mt-2 text-sm">{`Group: ${
                      task.group || "Personal Task"
                    }`}</Typography>
                    <Typography className="mt-3 font-bold text-lg">{`Status: ${task.status}`}</Typography>
                  </CardContent>
                </Card>
              </Link>
              <div className="flex justify-between p-4 bg-white">
                {/* Status Button */}
                <Button
                  variant="contained"
                  color={
                    task.status === "Pending"
                      ? "warning"
                      : task.status === "InProgress"
                      ? "primary"
                      : "success"
                  }
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the Link click
                    const nextStatus =
                      task.status === "Pending"
                        ? "InProgress"
                        : task.status === "InProgress"
                        ? "Completed"
                        : "Pending";
                    changeStatus(task._id, nextStatus);
                  }}
                  className="transition-transform transform hover:scale-105 bg-white text-black"
                >
                  {task.status === "Pending"
                    ? "Start Task"
                    : task.status === "InProgress"
                    ? "Mark Completed"
                    : "Reopen Task"}
                </Button>

                {/* Delete Button */}
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the Link click
                    deleteTask(task._id);
                  }}
                  className="transition-transform transform hover:scale-105 bg-white text-black"
                >
                  Delete Task
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography className="mx-4">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskList;

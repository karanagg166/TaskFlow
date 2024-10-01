import React, { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

interface Task {
  _id: any;
  title: string;
  description: string;
  assignedTo: string;
  dueDate?: string;
  status?: string;
  createdBy: string;
  priority?: string;
}

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasksPerPage] = useState<number>(5);
  const [totalTasks, setTotalTasks] = useState<number>(0);

  const fetchTasks = async () => {
    const id = localStorage.getItem("id");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/${id}/tasks`,
        {
          params: { page: currentPage, limit: tasksPerPage }, // Adjust your API endpoint accordingly
        }
      );
      const data = response.data;
      setTasks(data.tasks);
      setTotalTasks(data.totalTasks || 0); // Ensure totalTasks is defined
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Fetch tasks when currentPage changes

  const totalPages = Math.ceil(totalTasks / tasksPerPage); // Calculate total pages

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div
      className="container mx-auto min-h-screen flex flex-col justify-center"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <Typography
        variant="h4"
        className="font-bold text-blue-800 mb-4 text-center"
      >
        Tasks for Group
      </Typography>

      {/* Task list */}
      {tasks.length === 0 && <Typography>No tasks found.</Typography>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="shadow-xl rounded-lg overflow-hidden transform hover:-translate-y-2"
          >
            <Card
              className={`bg-gradient-to-r ${getPriorityColor(
                task.priority || "Low"
              )} p-6 text-white transition-transform duration-200 ease-in-out hover:scale-105`}
            >
              <CardContent>
                <Typography variant="h5" className="font-extrabold text-2xl">
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
                <Typography className="mt-2 text-sm">{`Assigned By: ${task.assignedTo}`}</Typography>
                <Typography className="mt-3 font-bold text-lg">{`Status: ${
                  task.status || "Pending"
                }`}</Typography>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="contained"
                    color={
                      task.status === "Pending"
                        ? "warning"
                        : task.status === "InProgress"
                        ? "primary"
                        : "success"
                    }
                    onClick={() => {
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ backgroundColor: "#333", color: "#fff" }} // Dark button style
        >
          Previous
        </Button>
        <Typography color="textSecondary">
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ backgroundColor: "#333", color: "#fff" }} // Dark button style
        >
          Next
        </Button>
      </div>
    </div>
  );
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

export default GroupPage;

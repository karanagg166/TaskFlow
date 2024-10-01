import React, { useState } from 'react';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedUser: string;
    dueDate?: string;
    status: 'Pending' | 'InProgress' | 'Completed';
    createdBy: string;
    priority?: string;
}

const TaskPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const task: Task = location.state?.task;
    const [currentStatus, setCurrentStatus] = useState(task?.status || 'Pending');

    if (!task) {
        return <Typography variant="h6" color="error">No task data available.</Typography>;
    }

    const changeStatus = async (taskId: string, newStatus: 'InProgress' | 'Pending' | 'Completed') => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/${taskId}/change_status`, { newStatus });
            if (response.status === 200) {
                setCurrentStatus(newStatus);  // Update status locally
                console.log(`Status changed to ${newStatus}`);
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const deleteTask = async (taskId: string) => {
        const id=localStorage.getItem('id');
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/${id}/${taskId}/delete`);
            if (response.status === 200) {
                navigate('/');  // Redirect to the main task list after deletion
                console.log(`Task deleted`);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="container mx-auto min-h-screen flex flex-col justify-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <Typography variant="h4" className="font-bold text-blue-800 mb-4 text-center">Task Details</Typography>

            {/* Task Detail Card */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="shadow-xl rounded-lg overflow-hidden transform hover:-translate-y-2"
            >
                <Card className={`bg-gradient-to-r ${getPriorityColor(task.priority || 'Low')} p-6 text-white transition-transform duration-200 ease-in-out hover:scale-105`}>
                    <CardContent>
                        <Typography variant="h5" className="font-extrabold text-2xl">{task.title}</Typography>
                        <Typography className="mt-2 text-base italic">{task.description || 'No description available'}</Typography>
                        <Typography className="mt-2 text-sm">{`Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}`}</Typography>
                        <Typography className="mt-2 text-sm">{`Assigned To: ${task.assignedUser}`}</Typography>
                        <Typography className="mt-3 font-bold text-lg">{`Status: ${currentStatus}`}</Typography>

                        <div className="flex justify-between mt-4">
                            {/* Status Button */}
                            <Button
                                variant="contained"
                                color={currentStatus === 'Pending' ? 'warning' : currentStatus === 'InProgress' ? 'primary' : 'success'}
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent link navigation on button click
                                    const nextStatus = currentStatus === 'Pending' ? 'InProgress' : currentStatus === 'InProgress' ? 'Completed' : 'Pending';
                                    changeStatus(task._id, nextStatus);
                                }}
                                className="transition-transform transform hover:scale-105 bg-white text-black"
                            >
                                {currentStatus === 'Pending' ? 'Start Task' : currentStatus === 'InProgress' ? 'Mark Completed' : 'Reopen Task'}
                            </Button>

                            {/* Delete Button */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent link navigation on button click
                                    deleteTask(task._id);
                                }}
                                className="transition-transform transform hover:scale-105 bg-white text-black"
                            >
                                Delete Task
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'Low':
            return 'from-green-300 to-green-500';
        case 'Medium':
            return 'from-yellow-300 to-yellow-500';
        case 'High':
            return 'from-red-300 to-red-500';
        default:
            return 'from-gray-300 to-gray-500';
    }
};

export default TaskPage;

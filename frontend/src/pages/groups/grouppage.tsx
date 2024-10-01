import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import TaskList from '../tasks/tasklist'; // Adjust the import path as needed
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Task {
    _id: string;
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

    const fetchTasks = async () => {
        const id = localStorage.getItem('id');
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/${id}/tasks`); // Adjust your API endpoint accordingly
            const data = response.data;
           console.log(data);
            setTasks(data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []); // Fetch tasks when groupId changes

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className="p-6 bg-gray-200 rounded-lg shadow-md">
            <Typography variant="h4" className="font-bold text-blue-800 mb-4">Tasks for Group</Typography>
            
            {/* Task list without any filtering */}
            <TaskList tasks={tasks} />

            {/* If there are no tasks to display */}
            {tasks.length === 0 && (
                <Typography>No tasks found.</Typography>
            )}
        </div>
    );
};

export default GroupPage;

// TaskCard.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Task {
    _id: string;
    title: string;
    description: string;
}

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <Card className="hover:scale-105 transition-transform duration-300 shadow-lg mb-4">
            <CardContent>
                <Typography variant="h6" className="font-bold text-blue-800">{task.title}</Typography>
                <Typography variant="body1" className="text-gray-600">{task.description}</Typography>
            </CardContent>
        </Card>
    );
};

export default TaskCard;

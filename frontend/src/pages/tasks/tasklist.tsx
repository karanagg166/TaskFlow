// TaskList.tsx
import React from "react";
import TaskCard from "./taskcard";

interface Task {
  _id: any;
  title: string;
  description: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

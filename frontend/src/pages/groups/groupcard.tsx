// GroupCard.tsx
import { FC } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Group {
  _id: any;
  name: string;
  description: string;
  createdBy: { name: string };
  createdAt: string;
}

interface GroupCardProps {
  group: Group;
}

const GroupCard: FC<GroupCardProps> = ({ group }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    localStorage.setItem("groupId", group._id);
    navigate(`/group/${group._id}/page`); // Navigate to the group page
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 4px 20px rgba(0, 123, 255, 0.5)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        onClick={handleCardClick}
        className="bg-white shadow-md hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
      >
        <CardContent>
          <Typography variant="h5" className="font-bold text-blue-800">
            {group.name}
          </Typography>
          <Typography className="text-sm text-gray-600">{`Description: ${group.description}`}</Typography>
          <Typography variant="subtitle1" className="text-gray-500">
            Created by: {group.createdBy.name}
          </Typography>
          <Typography className="text-sm text-gray-600">{`Created At: ${new Date(
            group.createdAt
          ).toLocaleDateString()}`}</Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GroupCard;

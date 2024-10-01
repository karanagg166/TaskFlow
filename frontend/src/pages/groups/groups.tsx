import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Typography, Grid } from "@mui/material";
import GroupCard from "./groupcard";
import CreateGroupPage from "./creategroup"; // Import the CreateGroupPage component

interface User {
  _id: any;
  name: string;
}

interface Group {
  _id: any;
  name: string;
  description: string;
  createdAt: string;
  createdBy: User;
}

const GroupsPage: FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGroups = async () => {
    const id = localStorage.getItem("id");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${id}/all_groups`
      );
      setGroups(response.data.groups);
      console.log(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div
      className="container mx-auto min-h-screen flex flex-col items-center pt-20 pb-20 bg-blue-50"
      style={{ marginTop: "200px" }}
    >
      <Typography
        variant="h4"
        className="mb-8 text-gray-800 font-bold text-center"
      >
        Your Groups
      </Typography>

      {/* Render CreateGroupPage directly */}
      <CreateGroupPage />

      {loading ? (
        <p className="text-lg">Loading groups...</p>
      ) : (
        <Grid container spacing={3}>
          {groups.length > 0 ? (
            groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group._id}>
                <GroupCard group={group} />
              </Grid>
            ))
          ) : (
            <Typography>No groups available.</Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default GroupsPage;

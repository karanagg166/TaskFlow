import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios"; // Import axios for API requests

// Define the interface for group information
interface GroupInfo {
  name: string;
  description: string;
  createdBy: {
    _id: any;
    name: string; // Assuming createdBy is an object with name and id
  };
  createdAt: string; // Keep it as a string for formatting
}

const GroupEntryPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null); // Use the defined interface
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>(); // Fetching groupId from URL parameters

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return; // Check if groupId exists

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/info`
        ); // Use the groupId in the API call
        setGroupInfo(response.data.group);
        console.log(response.data.group); // Assuming the response contains the group information under the `group` property
      } catch (error) {
        console.error("Error fetching group info:", error);
        setError("Failed to load group information.");
      }
    };

    fetchGroupInfo();
  }, [groupId]); // Include groupId as a dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const id = localStorage.getItem("id");
      // Send password to the backend for verification
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/${id}/join_group`,
        { password } // Use the groupId in the API call
      );
      if (response.data.success) {
        navigate("/other-page"); // Navigate to the desired page on success
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("An error occurred while verifying the password.");
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };

  // Helper function to format date string
  const formatDateString = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {groupInfo ? ( // Check if group info is loaded
          <>
            <motion.h1
              className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              {groupInfo.name} {/* Display the group name */}
            </motion.h1>
            <p className="text-center text-gray-500">
              Created by {groupInfo.createdBy.name}
            </p>{" "}
            {/* Updated to access name */}
            <p className="text-center text-gray-400">
              Created at {formatDateString(groupInfo.createdAt)}
            </p>{" "}
            {/* Format the date */}
            <p className="text-center text-gray-600">
              {groupInfo.description}
            </p>{" "}
            {/* Display group description */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <TextField
                  type="password"
                  label="Enter Group Password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Join Group"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Loading group information...
          </div> // Loading state for group info
        )}
      </motion.div>
    </div>
  );
};

export default GroupEntryPage;

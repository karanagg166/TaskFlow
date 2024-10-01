import { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GroupSearchPage = () => {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all groups from the backend when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getallgroups`); // Adjust the endpoint according to your backend
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        setGroups(data.groups);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message); // Safely access the message property
        } else {
            setError('Failed to fetch groups');
        }
    }
     finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Filter groups based on the search input
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Handle joining a group
  const handleJoinGroup = (groupId: string) => {
    // Navigate to the group page (adjust the path as necessary)
    navigate(`/group/${groupId}/entry`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-500">
      <motion.h1
        className="text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Search Groups
      </motion.h1>
      <form onSubmit={(e) => e.preventDefault()} className="mb-6 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Group Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="mb-4"
          />
        </motion.div>
      </form>
      {loading && <CircularProgress size={24} color="inherit" />}
      {error && <Typography variant="body1" className="text-red-500 mb-4">{error}</Typography>}
      {filteredGroups.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-4"
        >
          {filteredGroups.map((group) => (
            <li key={group.id} className="flex justify-between items-center text-lg text-gray-800 border-b last:border-b-0 py-2">
              <span>{group.name} (ID: {group._id})</span>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoinGroup(group._id)}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-800"
              >
                Join
              </Button>
            </li>
          ))}
        </motion.ul>
      )}
      {filteredGroups.length === 0 && !loading && !error && (
        <Typography variant="body1" className="text-white mt-4">No groups found.</Typography>
      )}
    </div>
  );
};

export default GroupSearchPage;

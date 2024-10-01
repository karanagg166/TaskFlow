// src/components/SideNavbar.tsx

import { motion } from 'framer-motion';
import { FaUsers, FaTasks, FaCog, FaInfoCircle, FaPlus } from 'react-icons/fa';
import { Button } from '@mui/material';
import {  Link } from 'react-router-dom'; // Import useParams and Link

const SideNavbar = () => {
  const  groupId=localStorage.getItem('groupId'); // Get the groupId from URL params

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen fixed top-0 left-0 z-50 w-16 bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-600 shadow-xl"
      style={{ marginTop: '4rem' }} // Adjust this value to leave space from the header
    >
      <div className="flex flex-col items-center space-y-8 pt-4"> {/* Adjust padding top here if needed */}
        {/* Members */}
        <Link to={`/group/${groupId}/members`}>
          <motion.div whileHover={{ scale: 1.1 }} className="group">
            <Button
              className="bg-blue-500 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center"
              color="primary"
              startIcon={<FaUsers className="text-white" />}
            />
            <span className="mt-2 text-xs text-white group-hover:text-purple-200 transition-all duration-300">
              Members
            </span>
          </motion.div>
        </Link>

        {/* Create Task */}
        <Link to={`/group/${groupId}/create_task`}>
          <motion.div whileHover={{ scale: 1.1 }} className="group">
            <Button
              className="bg-purple-500 hover:bg-purple-700 w-12 h-12 rounded-full flex items-center justify-center"
              color="secondary"
              startIcon={<FaPlus className="text-white" />}
            />
            <span className="mt-2 text-xs text-white group-hover:text-purple-200 transition-all duration-300">
              Create Task
            </span>
          </motion.div>
        </Link>

        {/* Tasks */}
        <Link to={`/group/${groupId}/page`}>
          <motion.div whileHover={{ scale: 1.1 }} className="group">
            <Button
              className="bg-green-500 hover:bg-green-700 w-12 h-12 rounded-full flex items-center justify-center"
              startIcon={<FaTasks className="text-white" />}
            />
            <span className="mt-2 text-xs text-white group-hover:text-purple-200 transition-all duration-300">
              Tasks
            </span>
          </motion.div>
        </Link>

        {/* Change Settings */}
        <Link to={`/groups/${groupId}/settings`}>
          <motion.div whileHover={{ scale: 1.1 }} className="group">
            <Button
              className="bg-yellow-500 hover:bg-yellow-700 w-12 h-12 rounded-full flex items-center justify-center"
              startIcon={<FaCog className="text-white" />}
            />
            <span className="mt-2 text-xs text-white group-hover:text-purple-200 transition-all duration-300">
              Settings
            </span>
          </motion.div>
        </Link>

        {/* Group Info */}
        <Link to={`/groups/${groupId}/info`}>
          <motion.div whileHover={{ scale: 1.1 }} className="group">
            <Button
              className="bg-red-500 hover:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center"
              startIcon={<FaInfoCircle className="text-white" />}
            />
            <span className="mt-2 text-xs text-white group-hover:text-purple-200 transition-all duration-300">
              Info
            </span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default SideNavbar;

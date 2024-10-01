import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TextField, Button, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, { username, password });
            console.log(response.data);
            const token = response.data.token; // Adjust according to your API response
            localStorage.setItem('token', token);
            localStorage.setItem('id', response.data.user._id);
            
            // Navigate to the create task page after successful login
            navigate('/user/createtask'); 
        } catch (error) {
            console.error("Error logging in:", error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-400 to-dark-blue-500">
            <motion.div 
                className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full space-y-6" 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" component="h1" className="text-center text-gray-800 mb-4 font-bold">
                    Login to Your Account
                </Typography>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField 
                        label="Username" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <AccountCircleIcon className="mr-2 text-gray-400" />
                            ),
                        }}
                        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    />
                    <TextField 
                        label="Password" 
                        variant="outlined" 
                        type={showPassword ? 'text' : 'password'} 
                        fullWidth 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <LockIcon className="mr-2 text-gray-400" />
                            ),
                            endAdornment: (
                                <Button 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="text-gray-400"
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </Button>
                            ),
                        }}
                        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        className="transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105"
                    >
                        Login
                    </Button>
                </form>

                <Typography variant="body2" className="text-center text-gray-600">
                    <a href="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</a>
                </Typography>
                <Typography variant="body2" className="text-center text-gray-600">
                    New User? <a href="/user/signup" className="text-indigo-600 hover:underline">Sign Up</a>
                </Typography>
            </motion.div>
        </div>
    );
};

export default LoginPage;

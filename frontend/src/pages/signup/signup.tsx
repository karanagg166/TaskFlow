import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TextField, Button, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>(''); // New state for name
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate(); // Initialize useNavigate
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            //${import.meta.env.VITE_BACKEND_URL}
            const response = await axios.post(`/api/register`, { email, username, name, password }); // Include name in the request
            console.log(response.data);
            const token = response.data.token; // Adjust according to your API response
            localStorage.setItem('token', token);
            localStorage.setItem('id',response.data.user._id);
            navigate('/user/createtask'); 
        } catch (error: unknown) { // Use unknown instead of any
            console.error("Error signing up:", error);
    
            if (axios.isAxiosError(error) && error.response) {
                // Now TypeScript knows that error is an Axios error
                const errorMessage = error.response.data.message;
    
                // Alert specific error messages
                if (errorMessage === 'User already exists with this email or username.') {
                    alert("User already exists with this email or username.");
                } else {
                    alert("Error signing up: " + errorMessage); // Generic error message
                }
            } else {
                alert("An unknown error occurred. Please try again later.");
            }
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
                    Create Your Account
                </Typography>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField 
                        label="Name" // New Name field
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Update state for name
                        InputProps={{
                            startAdornment: (
                                <AccountCircleIcon className="mr-2 text-gray-400" />
                            ),
                        }}
                        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    />
                    <TextField 
                        label="Email" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <EmailIcon className="mr-2 text-gray-400" />
                            ),
                        }}
                        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    />
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
                    <TextField 
                        label="Confirm Password" 
                        variant="outlined" 
                        type={showPassword ? 'text' : 'password'} 
                        fullWidth 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <LockIcon className="mr-2 text-gray-400" />
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
                        Sign Up
                    </Button>
                </form>

                <Typography variant="body2" className="text-center text-gray-600">
                    Already have an account? <a href="/user/login" className="text-indigo-600 hover:underline">Login here</a>
                </Typography>
            </motion.div>
        </div>
    );
};

export default SignUpPage;

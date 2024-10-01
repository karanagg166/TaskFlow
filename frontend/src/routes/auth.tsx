// src/routes/AuthRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface AuthRouteProps {
    element: JSX.Element;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/protected-resource`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Use Bearer token format
                        },
                    });

                    // Assuming the response contains a success status
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Set loading to false after verification
        };

        verifyToken();
    }, []);

    // Show a loading state while verifying the token
    if (loading) {
        return <div>Loading...</div>; // You can replace this with a better loading state
    }

    return isAuthenticated ? element : <Navigate to="/user/login" replace />;
};

export default AuthRoute;

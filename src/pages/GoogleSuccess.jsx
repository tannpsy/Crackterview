// src/frontend/GoogleSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../frontend/context/AuthContext';

const GoogleSuccess = () => {
    const [searchParams] = useSearchParams();
    const { checkAuthStatus, user } = useAuth();
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            checkAuthStatus().finally(() => {
                setIsCheckingAuth(false);
            });
        } else {
            navigate('/login');
        }
    }, [searchParams, checkAuthStatus, navigate]);

    useEffect(() => {
        console.log("User state changed:", user);
        if (!isCheckingAuth && user) {
            if (user.isHR) {
                navigate('/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } else if (!isCheckingAuth && !user) {
            navigate('/login');
        }
    }, [isCheckingAuth, user, navigate]);

    return null;
};

export default GoogleSuccess;
// useEffect(() => {
//         const token = searchParams.get('token');
//         if (token) {
//             localStorage.setItem('jwtToken', token);
//             checkAuthStatus(); 
//             navigate('/dashboard');
//         } else {
//             navigate('/login');
//         }
//     }, [searchParams, checkAuthStatus, navigate]);
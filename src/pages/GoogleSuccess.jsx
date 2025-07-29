import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../frontend/context/AuthContext';

const GoogleSuccess = () => {
    const [searchParams] = useSearchParams();
    const { checkAuthStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('jwtToken', token);
            checkAuthStatus(); 
            navigate('/posts');
        } else {
            navigate('/login');
        }
    }, [searchParams, checkAuthStatus, navigate]);

    return null;
};

export default GoogleSuccess;
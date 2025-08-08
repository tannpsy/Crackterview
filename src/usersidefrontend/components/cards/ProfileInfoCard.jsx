import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { getInitials } from "../../utils/helper";

const ProfileInfoCard = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
const [localUser, setLocalUser] = useState(user);

    useEffect(() => {
  if (user && !user.username) {
    window.location.reload();
  }
}, [user]);
    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    };
    
    return (
        user && (
        <div className='flex items-center'>
            {user.profileImageUrl ? (
                <img
                src={user.profileImageUrl}
                alt=''
                className='w-11 h-11 bg-gray-300 rounded-full mr-3'
                />
            ) : (
                <div className='w-11 h-11 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-xl font-bold text-white'>
                {getInitials(user.username || "")}
                </div>
            )}
            <div>
                <div
                    className='text-[15px] text-black font-bold leading-3'
                >
                    {user.username || ""}
                </div>
                <button
                    className='text-black text-[13px] font-normal cursor-pointer hover:underline mt-1'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    ))
}

export default ProfileInfoCard;
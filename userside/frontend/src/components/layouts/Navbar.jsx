import React from 'react';
import ProfileInfoCard from '../cards/ProfileInfoCard';
import { Link } from 'react-router-dom';


const Navbar = () => {

    return (
        <div className='h-16 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
            <div className='container mx-auto flex items-center justify-between relative h-full'>
                {/* Left: Logo */}
                <Link to='/dashboard' className='flex-shrink-0'>
                <h2 className='text-xl md:text-4xl font-bold text-black leading-5'>
                    Crackterview
                </h2>
                </Link>

                {/* Center: Page Title */}
                <div className='absolute left-1/2 transform -translate-x-1/2'>
                <h3 className='text-base md:text-lg font-semibold text-gray-700'>
                    Dashboard
                </h3>
                </div>

                {/* Right: Profile */}
                <div className='flex-shrink-0'>
                <ProfileInfoCard />
                </div>
            </div>
        </div>

    );
};

export default Navbar;

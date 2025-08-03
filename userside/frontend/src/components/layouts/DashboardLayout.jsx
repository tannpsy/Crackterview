import React from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { Children } from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({children}) => {
    const {user} = useContext(UserContext);

    return (
        <div className="">
            <Navbar/>
            
            {user && <div>{children}</div>}
        </div>
    );
};

export default DashboardLayout;

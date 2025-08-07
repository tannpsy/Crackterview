import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content: grows to push footer to bottom */}
      <main className="flex-grow">
        {user && <>{children}</>}
      </main>
    </div>
  );
};

export default DashboardLayout;

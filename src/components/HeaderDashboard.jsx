import { useAuth } from "../frontend/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function DashboardHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center px-2 sm:px-4 lg:px-6">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/dashboard">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-8 text-black font-['League_Spartan']">
            Crackterview
          </h1>
        </Link>
      </div>

      {/* Dashboard Title - Center */}
      <div className="flex-1 text-center">
        <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-semibold leading-8 text-black font-['DM_Sans']">
          Dashboard
        </h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">

        <div className="hidden md:flex items-center justify-center w-8 h-8">
          <span className="text-base font-light text-[#5A5A5D] font-['Lato']">
            EN
          </span>
        </div>

        {/* Notification Icon */}
        <button className="w-[30px] h-[30px] flex-shrink-0 hover:opacity-80 transition-opacity">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/4af274703497c1e23beb9469cb293b55509c4a0f?width=60"
            alt="Notifications"
            className="w-full h-full object-contain"
          />
        </button>

        {/* Settings Icon */}
        <button className="w-[30px] h-[30px] flex-shrink-0 hover:opacity-80 transition-opacity">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/ba168a5b50ac17a221e4472342b56c3801d14800?width=60"
            alt="Settings"
            className="w-full h-full object-contain"
          />
        </button>

        {/* User Account */}
        {isAuthenticated && (
          <div className="relative flex items-center gap-2">
            <div 
              className="flex items-center gap-2 rounded-lg p-1 transition-colors cursor-pointer hover:bg-gray-50"
              onClick={toggleDropdown}
            >
              {/* Avatar */}
              <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>

              {/* Username and Dropdown Arrow */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 font-['Lato']">
                  {user?.username || user?.email || "Admin"}
                </span>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 18 18" 
                  className={`flex-shrink-0 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 7L12 7L9 11L6 7Z" fill="#5A5A5D" />
                </svg>
              </div>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-10 mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-[160px] py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

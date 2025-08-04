import { useAuth } from "../frontend/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export default function DashboardHeader({ notifications = [] }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef = useRef(null);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Render Avatar
  const renderAvatar = () => {
    const initial =
      user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
        {initial}
      </div>
    );
  };

  // 🔹 Render Dropdown Menu
  const renderMenu = () =>
    menuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium">{user?.username || "No Username"}</p>
          <p className="text-xs text-gray-500">{user?.email || "No Email"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
        >
          Logout
        </button>
      </div>
    );

  // 🔹 Render Notifications Modal
  const renderNotificationsModal = () =>
    notifOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-xl shadow-lg w-[400px] max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
              onClick={() => setNotifOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="border p-3 rounded-lg hover:bg-gray-50"
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.time}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No notifications yet
              </p>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <>
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-crackterview-black"
        >
          Crackterview
        </Link>

        <div className="flex items-center space-x-4">
          {/* 🔔 Notifications Button */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative w-[30px] h-[30px] flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/4af274703497c1e23beb9469cb293b55509c4a0f?width=60"
              alt="Notifications"
              className="w-full h-full object-contain"
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* 🔹 Authenticated User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-3 py-1 rounded-full"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {renderAvatar()}
                <span className="font-medium">
                  {user?.username || user?.email}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {renderMenu()}
            </div>
          ) : (
            <Link
              to="/"
              className="px-4 py-2 bg-crackterview-blue text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {renderNotificationsModal()}
    </>
  );
}

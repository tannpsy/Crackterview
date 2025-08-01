import { useAuth } from "../frontend/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function DashboardHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <Link to="/dashboard" className="text-xl font-bold text-crackterview-black">
        Crackterview
      </Link>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-medium">{user?.username || user?.email}</span>
            </button>
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
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
  );
}

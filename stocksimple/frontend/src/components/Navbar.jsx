import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">StockSimple</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-white transition">
                Products
              </Link>
              <Link to="/stock-update" className="text-gray-300 hover:text-white transition">
                Stock Update
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
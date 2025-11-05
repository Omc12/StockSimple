import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const isAuthPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Single Navbar for all pages */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-blue-500">
              StockSimple
            </Link>
            
            {user ? (
              // Authenticated navbar
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
                <Link to="/stock-update" className="text-gray-300 hover:text-white transition-colors">
                  Stock Update
                </Link>
                <Link to="/inventory-log" className="text-gray-300 hover:text-white transition-colors">
                  Inventory Log
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                  <span className="text-gray-400">{user.name}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Public navbar
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
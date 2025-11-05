import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Simple Navbar for Landing */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              StockSimple
            </Link>
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simplify Your Inventory Management
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Track stock, manage products, and get real-time alerts with StockSimple
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
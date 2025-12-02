import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Product Catalog',
      description: 'Manage all your products in one place with SKU, cost, and stock levels.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: 'Low-Stock Alerts',
      description: 'Get instant alerts when products fall below reorder points to prevent stockouts.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      title: 'Quick Stock Adjustment',
      description: 'Log stock in/out movements with reasons in seconds. Perfect for busy staff.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Visual Reports',
      description: 'Bar charts showing top/low stocked items to make data-driven decisions.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Search & Filter',
      description: 'Quickly locate products with powerful search, sorting, and filtering options.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure Authentication',
      description: 'JWT-based authentication keeps your inventory data safe and protected.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <span className="text-blue-400 text-sm font-medium">Essential Inventory Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Simplify Your <span className="text-blue-500">Inventory</span> Management
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            StockSimple helps small retailers and warehouses track stock, manage products, and get real-time low-stock alerts. No more spreadsheet chaos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Get Started Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 text-white text-lg font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">The Problem We Solve</h2>
            <p className="text-gray-400 text-lg">
              Small retailers and local warehouses often use disorganized spreadsheets to manage product inventory, leading to frequent stockouts of popular items or excess stock of slow movers. StockSimple provides a simple, centralized solution to track current stock levels, log product movements, and automatically generate low-stock alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed specifically for small business inventory management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built with Modern Tech</h2>
            <p className="text-gray-400">Reliable, fast, and scalable technology stack</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {[
              { name: 'React.js', color: 'text-cyan-400' },
              { name: 'Node.js', color: 'text-green-400' },
              { name: 'Express', color: 'text-gray-300' },
              { name: 'PostgreSQL', color: 'text-blue-400' },
              { name: 'Prisma', color: 'text-purple-400' },
              { name: 'TailwindCSS', color: 'text-teal-400' },
              { name: 'JWT Auth', color: 'text-yellow-400' },
              { name: 'Recharts', color: 'text-pink-400' },
            ].map((tech, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-lg"
              >
                <span className={`font-medium ${tech.color}`}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Simplify Your Inventory?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join small businesses who've already streamlined their stock management with StockSimple.
            </p>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get Started Now — It's Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
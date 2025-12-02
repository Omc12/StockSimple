import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo and Tagline */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-white font-bold">StockSimple</span>
                            <p className="text-gray-500 text-sm">Inventory made easy</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center space-x-6 text-sm">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white transition">
                            Dashboard
                        </Link>
                        <Link to="/products" className="text-gray-400 hover:text-white transition">
                            Products
                        </Link>
                        <Link to="/reports" className="text-gray-400 hover:text-white transition">
                            Reports
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} StockSimple
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                            Designed for small businesses
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
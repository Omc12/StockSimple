import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getLowStockAlerts, getProducts, getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentMovements, setRecentMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [alertsRes, productsRes, movementsRes] = await Promise.all([
                getLowStockAlerts(),
                getProducts(),
                getStockMovements(),
            ]);
            
            setLowStockAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
            setTotalProducts(productsRes.data?.length || 0);
            setRecentMovements(movementsRes.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setLowStockAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user?.name || 'User'}</span>!
                        </h1>
                        <p className="text-gray-400">Here's what's happening with your inventory today.</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link to="/add-product" className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl p-5 text-center transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg className="w-10 h-10 mx-auto text-white mb-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-white font-semibold relative z-10">Add Product</p>
                </Link>
                <Link to="/stock-update" className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 rounded-2xl p-5 text-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg className="w-10 h-10 mx-auto text-white mb-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <p className="text-white font-semibold relative z-10">Update Stock</p>
                </Link>
                <Link to="/products" className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 rounded-2xl p-5 text-center transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg className="w-10 h-10 mx-auto text-white mb-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-white font-semibold relative z-10">View Products</p>
                </Link>
                <Link to="/reports" className="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 rounded-2xl p-5 text-center transition-all duration-300 shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg className="w-10 h-10 mx-auto text-white mb-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-white font-semibold relative z-10">Reports</p>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Products</p>
                                <p className="text-4xl font-bold text-white mt-2">{totalProducts}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-2xl">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className={`absolute -inset-0.5 rounded-2xl blur transition duration-300 ${lowStockAlerts.length > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 opacity-25 group-hover:opacity-40' : 'bg-gradient-to-r from-green-500 to-emerald-500 opacity-25 group-hover:opacity-40'}`}></div>
                    <div className="relative bg-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Low Stock Alerts</p>
                                <p className={`text-4xl font-bold mt-2 ${lowStockAlerts.length > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                                    {lowStockAlerts.length}
                                </p>
                            </div>
                            <div className={`p-4 rounded-2xl ${lowStockAlerts.length > 0 ? 'bg-gradient-to-br from-orange-500/20 to-red-600/10' : 'bg-gradient-to-br from-green-500/20 to-emerald-600/10'}`}>
                                <svg className={`w-8 h-8 ${lowStockAlerts.length > 0 ? 'text-orange-400' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Recent Movements</p>
                                <p className="text-4xl font-bold text-white mt-2">{recentMovements.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/10 p-4 rounded-2xl">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <div className="p-2 bg-orange-500/10 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        Low Stock Alerts
                    </h2>
                    {lowStockAlerts.length > 0 && (
                        <Link to="/stock-update" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            Update Stock
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
                
                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-400">{error}</p>
                        <button 
                            onClick={fetchDashboardData}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : lowStockAlerts.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-400">All products are well stocked!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">SKU</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Stock</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Reorder Point</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockAlerts.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                                        <td className="py-3 px-4 text-gray-400 font-mono text-sm">{product.sku}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-bold ${product.currentStock === 0 ? 'text-red-400' : 'text-orange-400'}`}>
                                                {product.currentStock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{product.reorderPoint}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                              product.currentStock === 0 
                                                ? 'bg-red-500/20 text-red-400' 
                                                : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                              {product.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            {recentMovements.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        <Link to="/inventory-log" className="text-blue-400 hover:text-blue-300 text-sm">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentMovements.map((movement) => (
                            <div key={movement.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg mr-3 ${
                                        movement.type === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}>
                                        <svg className={`w-5 h-5 ${movement.type === 'in' ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                                movement.type === 'in' ? "M7 11l5-5m0 0l5 5m-5-5v12" : "M17 13l-5 5m0 0l-5-5m5 5V6"
                                            } />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{movement.product?.name || 'Unknown Product'}</p>
                                        <p className="text-gray-400 text-sm">
                                            {movement.type === 'in' ? 'Stock In' : 'Stock Out'} • {movement.reason || 'No reason'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-bold ${movement.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
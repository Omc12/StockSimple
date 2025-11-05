import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getLowStockAlerts, getTopLowReports } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [topLowReports, setTopLowReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const alerts = await getLowStockAlerts();
            const reports = await getTopLowReports();
            
            setLowStockAlerts(Array.isArray(alerts.data) ? alerts.data : []);
            setTopLowReports(reports.data || {});
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-400">Here's what's happening with your inventory today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Products</p>
                            <p className="text-3xl font-bold text-white mt-2">-</p>
                        </div>
                        <div className="bg-blue-500/10 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Low Stock Items</p>
                            <p className="text-3xl font-bold text-orange-500 mt-2">
                                {lowStockAlerts.length}
                            </p>
                        </div>
                        <div className="bg-orange-500/10 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Recent Movements</p>
                            <p className="text-3xl font-bold text-white mt-2">-</p>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Low Stock Alerts</h2>
                
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
                        <p className="text-gray-400">No low stock alerts at the moment.</p>
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
                                        <td className="py-3 px-4 text-white">{product.name}</td>
                                        <td className="py-3 px-4 text-gray-400">{product.sku}</td>
                                        <td className="py-3 px-4 text-white">{product.currentStock}</td>
                                        <td className="py-3 px-4 text-gray-400">{product.reorderPoint}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
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
        </div>
    );
};

export default Dashboard;
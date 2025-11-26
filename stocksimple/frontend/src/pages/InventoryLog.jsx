import React, { useEffect, useState } from 'react';
import { getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const InventoryLog = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, in, out

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            const response = await getStockMovements();
            setMovements(response.data || []);
        } catch (err) {
            setError('Failed to load inventory log');
            console.error('Error fetching movements:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMovements = movements.filter(m => {
        if (filter === 'all') return true;
        return m.type === filter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Inventory Log</h1>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'all' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('in')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'in' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        Stock In
                    </button>
                    <button
                        onClick={() => setFilter('out')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'out' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        Stock Out
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-400">{error}</p>
                        <button 
                            onClick={fetchMovements}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredMovements.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-400">No stock movements recorded yet.</p>
                        <p className="text-gray-500 text-sm mt-2">Stock movements will appear here when you update inventory.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">SKU</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Quantity</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Reason</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMovements.map((movement) => (
                                    <tr key={movement.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="py-3 px-4 text-gray-300 text-sm">
                                            {formatDate(movement.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-white">
                                            {movement.product?.name || 'Unknown'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 font-mono text-sm">
                                            {movement.product?.sku || '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                movement.type === 'in'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {movement.type === 'in' ? '↑ In' : '↓ Out'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`font-semibold ${
                                                movement.type === 'in' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-sm max-w-xs truncate">
                                            {movement.reason || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">
                                            {movement.user?.name || 'Unknown'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {movements.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Total Movements</p>
                        <p className="text-2xl font-bold text-white">{movements.length}</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Total Stock In</p>
                        <p className="text-2xl font-bold text-green-400">
                            +{movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0)}
                        </p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Total Stock Out</p>
                        <p className="text-2xl font-bold text-red-400">
                            -{movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryLog;
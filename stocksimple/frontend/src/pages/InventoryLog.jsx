import React, { useEffect, useState } from 'react';
import { getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const InventoryLog = () => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, in, out
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date'); // date, product, quantity
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [dateRange, setDateRange] = useState('all'); // all, today, week, month

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

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder(column === 'date' ? 'desc' : 'asc');
        }
    };

    // Filter by date range
    const filterByDateRange = (movement) => {
        if (dateRange === 'all') return true;
        
        const movementDate = new Date(movement.createdAt);
        const now = new Date();
        
        if (dateRange === 'today') {
            return movementDate.toDateString() === now.toDateString();
        } else if (dateRange === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return movementDate >= weekAgo;
        } else if (dateRange === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return movementDate >= monthAgo;
        }
        return true;
    };

    // Apply all filters
    const filteredMovements = movements.filter(m => {
        // Type filter
        if (filter !== 'all' && m.type !== filter) return false;
        
        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesProduct = m.product?.name?.toLowerCase().includes(search);
            const matchesSku = m.product?.sku?.toLowerCase().includes(search);
            const matchesReason = m.reason?.toLowerCase().includes(search);
            const matchesUser = m.user?.name?.toLowerCase().includes(search);
            if (!matchesProduct && !matchesSku && !matchesReason && !matchesUser) return false;
        }
        
        // Date range filter
        if (!filterByDateRange(m)) return false;
        
        return true;
    });

    // Sort movements
    const sortedMovements = [...filteredMovements].sort((a, b) => {
        let compareA, compareB;
        
        switch (sortBy) {
            case 'date':
                compareA = new Date(a.createdAt).getTime();
                compareB = new Date(b.createdAt).getTime();
                break;
            case 'product':
                compareA = a.product?.name?.toLowerCase() || '';
                compareB = b.product?.name?.toLowerCase() || '';
                break;
            case 'quantity':
                compareA = a.quantity;
                compareB = b.quantity;
                break;
            default:
                compareA = new Date(a.createdAt).getTime();
                compareB = new Date(b.createdAt).getTime();
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ column }) => (
        <span className="ml-1 inline-block">
            {sortBy === column ? (
                sortOrder === 'asc' ? '↑' : '↓'
            ) : (
                <span className="text-gray-600">↕</span>
            )}
        </span>
    );

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
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by product, SKU, reason, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3">
                    {/* Type Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('in')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'in' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Stock In
                        </button>
                        <button
                            onClick={() => setFilter('out')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                filter === 'out' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Stock Out
                        </button>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex gap-2 ml-auto">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                        </select>
                    </div>
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
                ) : sortedMovements.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-400">
                            {searchTerm || filter !== 'all' || dateRange !== 'all' 
                                ? 'No movements match your filters.' 
                                : 'No stock movements recorded yet.'}
                        </p>
                        {(searchTerm || filter !== 'all' || dateRange !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setFilter('all'); setDateRange('all'); }}
                                className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('date')}
                                    >
                                        Date & Time <SortIcon column="date" />
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('product')}
                                    >
                                        Product <SortIcon column="product" />
                                    </th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">SKU</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('quantity')}
                                    >
                                        Quantity <SortIcon column="quantity" />
                                    </th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Reason</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMovements.map((movement) => (
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

            {/* Results count */}
            {movements.length > 0 && (
                <p className="text-gray-400 text-sm mt-4">
                    Showing {sortedMovements.length} of {movements.length} movements
                </p>
            )}

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
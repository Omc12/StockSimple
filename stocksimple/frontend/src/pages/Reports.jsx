import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getProducts, getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState('');
  const [chartView, setChartView] = useState('quantity'); // 'quantity' or 'value'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, movementsRes] = await Promise.all([
        getProducts(),
        getStockMovements(),
      ]);
      setProducts(productsRes.data || []);
      setMovements(movementsRes.data || []);
    } catch (err) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.cost * p.currentStock), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.reorderPoint).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  
  const topStockProducts = [...products].sort((a, b) => b.currentStock - a.currentStock).slice(0, 5);
  const lowStockProducts = [...products].sort((a, b) => a.currentStock - b.currentStock).slice(0, 5);
  
  const totalStockIn = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
  const totalStockOut = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);

  // Prepare chart data for top 5 highest and lowest stock
  const topStockChartData = topStockProducts.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    fullName: p.name,
    quantity: p.currentStock,
    value: p.currentStock * p.cost,
    sku: p.sku,
  }));

  const lowStockChartData = lowStockProducts.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    fullName: p.name,
    quantity: p.currentStock,
    value: p.currentStock * p.cost,
    sku: p.sku,
    isLow: p.currentStock <= p.reorderPoint,
    isOut: p.currentStock === 0,
  }));

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-600 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold text-lg">{data.fullName}</p>
          <p className="text-gray-400 text-sm mb-2">SKU: {data.sku}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase">Quantity</p>
              <p className="text-blue-400 font-bold">{data.quantity}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase">Value</p>
              <p className="text-emerald-400 font-bold">₹{data.value.toFixed(2)}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Stock distribution data for pie chart
  const stockDistribution = [
    { name: 'In Stock', value: products.filter(p => p.currentStock > p.reorderPoint).length, color: '#22C55E' },
    { name: 'Low Stock', value: products.filter(p => p.currentStock > 0 && p.currentStock <= p.reorderPoint).length, color: '#F97316' },
    { name: 'Out of Stock', value: products.filter(p => p.currentStock === 0).length, color: '#EF4444' },
  ].filter(item => item.value > 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Inventory Reports
        </h1>
        <p className="text-gray-400">Comprehensive overview of your inventory performance</p>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
          <p className="text-red-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards with Gradient Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-slate-800 rounded-xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Products</span>
                </div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-4xl font-bold text-white mt-1">{totalProducts}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-slate-800 rounded-xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Value</span>
                </div>
                <p className="text-gray-400 text-sm">Inventory Value</p>
                <p className="text-4xl font-bold text-emerald-400 mt-1">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-slate-800 rounded-xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">Warning</span>
                </div>
                <p className="text-gray-400 text-sm">Low Stock Items</p>
                <p className="text-4xl font-bold text-orange-400 mt-1">{lowStockCount}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-slate-800 rounded-xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Critical</span>
                </div>
                <p className="text-gray-400 text-sm">Out of Stock</p>
                <p className="text-4xl font-bold text-red-400 mt-1">{outOfStockCount}</p>
              </div>
            </div>
          </div>

          {/* Movement Summary with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Stock In</p>
                  <p className="text-4xl font-bold text-green-400">+{totalStockIn.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs mt-2">Units received</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-2xl">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Stock Out</p>
                  <p className="text-4xl font-bold text-red-400">-{totalStockOut.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs mt-2">Units dispatched</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-4 rounded-2xl">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pie Chart for Stock Distribution */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-2">Stock Distribution</p>
              {stockDistribution.length > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stockDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stockDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {stockDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-400">{item.name}</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Top and Low Stock Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Highest Stock */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Highest Stock
                </span>
              </h2>
              {topStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-400">No products yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topStockProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group">
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg text-sm font-bold mr-4 shadow-lg shadow-green-500/20">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium group-hover:text-green-400 transition-colors">{product.name}</p>
                          <p className="text-gray-500 text-sm font-mono">{product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold text-lg">{product.currentStock}</span>
                        <p className="text-gray-500 text-xs">units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lowest Stock */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="p-2 bg-red-500/10 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  Lowest Stock
                </span>
              </h2>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-400">No products yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold mr-4 shadow-lg ${
                          product.currentStock === 0 
                            ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20' 
                            : product.currentStock <= product.reorderPoint 
                              ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20' 
                              : 'bg-slate-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className={`font-medium transition-colors ${
                            product.currentStock === 0 ? 'text-red-400' : 
                            product.currentStock <= product.reorderPoint ? 'text-orange-400' : 'text-white'
                          }`}>{product.name}</p>
                          <p className="text-gray-500 text-sm font-mono">{product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-lg ${
                          product.currentStock === 0 
                            ? 'text-red-400' 
                            : product.currentStock <= product.reorderPoint 
                              ? 'text-orange-400' 
                              : 'text-white'
                        }`}>
                          {product.currentStock}
                        </span>
                        <p className="text-gray-500 text-xs">
                          {product.currentStock === 0 ? 'OUT!' : 'units'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visual Bar Charts Section */}
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-slate-800 rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Visual Inventory Report
                  </h2>
                  <p className="text-gray-400 text-sm">Compare stock levels at a glance</p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => setChartView('quantity')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      chartView === 'quantity'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    📦 By Quantity
                  </button>
                  <button
                    onClick={() => setChartView('value')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      chartView === 'value'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    💰 By Value (₹)
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No products to display charts</p>
                  <p className="text-gray-500 text-sm mt-2">Add some products to see visual reports</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top 5 Highest Stock Chart */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center flex items-center justify-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Top 5 Highest Stock
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topStockChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <defs>
                            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22C55E" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#16A34A" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            axisLine={{ stroke: '#4B5563' }}
                          />
                          <YAxis 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => chartView === 'value' ? `₹${value}` : value}
                            axisLine={{ stroke: '#4B5563' }}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                          <Bar 
                            dataKey={chartView} 
                            fill="url(#greenGradient)"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top 5 Lowest Stock Chart */}
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center flex items-center justify-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      Top 5 Lowest Stock
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={lowStockChartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <defs>
                            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8}/>
                            </linearGradient>
                            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F97316" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#EA580C" stopOpacity={0.8}/>
                            </linearGradient>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            axisLine={{ stroke: '#4B5563' }}
                          />
                          <YAxis 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => chartView === 'value' ? `₹${value}` : value}
                            axisLine={{ stroke: '#4B5563' }}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} />
                          <Bar 
                            dataKey={chartView}
                            radius={[8, 8, 0, 0]}
                          >
                            {lowStockChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.isOut ? 'url(#redGradient)' : entry.isLow ? 'url(#orangeGradient)' : 'url(#blueGradient)'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
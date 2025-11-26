import React, { useState, useEffect } from 'react';
import { getProducts, getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState('');

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Inventory Reports</h1>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-white mt-2">{totalProducts}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Total Inventory Value</p>
              <p className="text-3xl font-bold text-green-400 mt-2">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-400 mt-2">{lowStockCount}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{outOfStockCount}</p>
            </div>
          </div>

          {/* Movement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Stock In</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">+{totalStockIn}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Stock Out</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">-{totalStockOut}</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top and Low Stock Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highest Stock */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Highest Stock Products
              </h2>
              {topStockProducts.length === 0 ? (
                <p className="text-gray-400">No products yet</p>
              ) : (
                <div className="space-y-3">
                  {topStockProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 flex items-center justify-center bg-green-500/20 text-green-400 rounded text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.sku}</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">{product.currentStock}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lowest Stock */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                Lowest Stock Products
              </h2>
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-400">No products yet</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-sm font-bold mr-3 ${
                          product.currentStock === 0 
                            ? 'bg-red-500/20 text-red-400' 
                            : product.currentStock <= product.reorderPoint 
                              ? 'bg-orange-500/20 text-orange-400' 
                              : 'bg-slate-600 text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.sku}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        product.currentStock === 0 
                          ? 'text-red-400' 
                          : product.currentStock <= product.reorderPoint 
                            ? 'text-orange-400' 
                            : 'text-white'
                      }`}>
                        {product.currentStock}
                      </span>
                    </div>
                  ))}
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
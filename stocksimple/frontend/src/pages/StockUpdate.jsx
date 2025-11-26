import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, logStockMovement } from '../services/api';

const StockUpdate = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await logStockMovement(formData);
      setSuccess(`Stock updated! New stock level: ${response.data.newStock}`);
      setFormData({
        productId: '',
        type: 'in',
        quantity: '',
        reason: '',
      });
      fetchProducts(); // Refresh product list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Update Stock</h1>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No products found. Add products first!</p>
              <button
                onClick={() => navigate('/add-product')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Select Product *</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select a product --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (SKU: {product.sku}) - Current Stock: {product.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Current Stock:</span>{' '}
                    <span className="text-white font-semibold">{selectedProduct.currentStock}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Reorder Point:</span>{' '}
                    <span className={selectedProduct.currentStock <= selectedProduct.reorderPoint ? 'text-orange-400' : 'text-white'}>
                      {selectedProduct.reorderPoint}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2">Movement Type *</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${
                    formData.type === 'in' 
                      ? 'bg-green-500/20 border-green-500 text-green-400' 
                      : 'bg-slate-700 border-slate-600 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="in"
                      checked={formData.type === 'in'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-semibold">Stock In</span>
                      <p className="text-sm opacity-75">Add to inventory</p>
                    </div>
                  </label>
                  
                  <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${
                    formData.type === 'out' 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-slate-700 border-slate-600 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="out"
                      checked={formData.type === 'out'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      <span className="font-semibold">Stock Out</span>
                      <p className="text-sm opacity-75">Remove from inventory</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Reason (Optional)</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., New shipment received, Sold to customer, Damaged goods"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 ${
                    formData.type === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting ? 'Updating...' : `Record Stock ${formData.type === 'in' ? 'In' : 'Out'}`}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockUpdate;
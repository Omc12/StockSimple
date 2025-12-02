import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, updateProduct } from '../services/api';

const ProductCatalog = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, low-stock, out-of-stock
    const [sortBy, setSortBy] = useState('name'); // name, sku, stock, cost
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product.id);
        setEditForm({
            name: product.name,
            cost: product.cost,
            reorderPoint: product.reorderPoint,
        });
    };

    const handleSaveEdit = async (sku) => {
        try {
            await updateProduct(sku, editForm);
            await fetchProducts();
            setEditingProduct(null);
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Stock status filter
        let matchesStockFilter = true;
        if (stockFilter === 'in-stock') {
            matchesStockFilter = product.currentStock > product.reorderPoint;
        } else if (stockFilter === 'low-stock') {
            matchesStockFilter = product.currentStock > 0 && product.currentStock <= product.reorderPoint;
        } else if (stockFilter === 'out-of-stock') {
            matchesStockFilter = product.currentStock === 0;
        }

        return matchesSearch && matchesStockFilter;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let compareA, compareB;
        
        switch (sortBy) {
            case 'name':
                compareA = a.name.toLowerCase();
                compareB = b.name.toLowerCase();
                break;
            case 'sku':
                compareA = a.sku.toLowerCase();
                compareB = b.sku.toLowerCase();
                break;
            case 'stock':
                compareA = a.currentStock;
                compareB = b.currentStock;
                break;
            case 'cost':
                compareA = a.cost;
                compareB = b.cost;
                break;
            default:
                compareA = a.name.toLowerCase();
                compareB = b.name.toLowerCase();
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, stockFilter, sortBy, sortOrder]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const SortIcon = ({ column }) => (
        <span className="ml-1 inline-block">
            {sortBy === column ? (
                sortOrder === 'asc' ? '↑' : '↓'
            ) : (
                <span className="text-gray-600">↕</span>
            )}
        </span>
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Product Catalog</h1>
                <Link
                    to="/add-product"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </Link>
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
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Filter and Sort Row */}
                <div className="flex flex-wrap gap-3">
                    {/* Stock Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStockFilter('all')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                stockFilter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            All ({products.length})
                        </button>
                        <button
                            onClick={() => setStockFilter('in-stock')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                stockFilter === 'in-stock' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            In Stock ({products.filter(p => p.currentStock > p.reorderPoint).length})
                        </button>
                        <button
                            onClick={() => setStockFilter('low-stock')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                stockFilter === 'low-stock' 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Low Stock ({products.filter(p => p.currentStock > 0 && p.currentStock <= p.reorderPoint).length})
                        </button>
                        <button
                            onClick={() => setStockFilter('out-of-stock')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                stockFilter === 'out-of-stock' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Out of Stock ({products.filter(p => p.currentStock === 0).length})
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                {sortedProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-400 mb-4">
                            {searchTerm || stockFilter !== 'all' ? 'No products match your filters.' : 'No products found. Add your first product!'}
                        </p>
                        {!searchTerm && stockFilter === 'all' && (
                            <Link
                                to="/add-product"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add Product
                            </Link>
                        )}
                        {(searchTerm || stockFilter !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setStockFilter('all'); }}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
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
                                        onClick={() => handleSort('name')}
                                    >
                                        Name <SortIcon column="name" />
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('sku')}
                                    >
                                        SKU <SortIcon column="sku" />
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('cost')}
                                    >
                                        Cost <SortIcon column="cost" />
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 text-gray-400 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('stock')}
                                    >
                                        Stock <SortIcon column="stock" />
                                    </th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Reorder Point</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="py-3 px-4">
                                            {editingProduct === product.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-full"
                                                />
                                            ) : (
                                                <span className="text-white font-medium">{product.name}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 font-mono text-sm">{product.sku}</td>
                                        <td className="py-3 px-4">
                                            {editingProduct === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.cost}
                                                    onChange={(e) => setEditForm({...editForm, cost: e.target.value})}
                                                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-20"
                                                />
                                            ) : (
                                                <span className="text-white">₹{product.cost.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`font-semibold ${
                                                product.currentStock === 0 
                                                    ? 'text-red-400' 
                                                    : product.currentStock <= product.reorderPoint 
                                                        ? 'text-orange-400' 
                                                        : 'text-green-400'
                                            }`}>
                                                {product.currentStock}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {editingProduct === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.reorderPoint}
                                                    onChange={(e) => setEditForm({...editForm, reorderPoint: e.target.value})}
                                                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white w-20"
                                                />
                                            ) : (
                                                <span className="text-gray-400">{product.reorderPoint}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.currentStock === 0 
                                                    ? 'bg-red-500/20 text-red-400' 
                                                    : product.currentStock <= product.reorderPoint 
                                                        ? 'bg-orange-500/20 text-orange-400' 
                                                        : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {product.currentStock === 0 
                                                    ? 'Out of Stock' 
                                                    : product.currentStock <= product.reorderPoint 
                                                        ? 'Low Stock' 
                                                        : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {editingProduct === product.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(product.sku)}
                                                            className="p-1 text-green-400 hover:text-green-300"
                                                            title="Save"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingProduct(null)}
                                                            className="p-1 text-gray-400 hover:text-gray-300"
                                                            title="Cancel"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-1 text-blue-400 hover:text-blue-300"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => navigate('/stock-update')}
                                                            className="p-1 text-green-400 hover:text-green-300"
                                                            title="Update Stock"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(product.id)}
                                                            className="p-1 text-red-400 hover:text-red-300"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {sortedProducts.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            Showing {startIndex + 1} to {Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                        </p>
                        <div className="flex items-center gap-2">
                            <label className="text-gray-400 text-sm">Per page:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        (page === currentPage - 2 && currentPage > 3) ||
                                        (page === currentPage + 2 && currentPage < totalPages - 2)
                                    ) {
                                        return <span key={page} className="text-gray-500 px-1">...</span>;
                                    }
                                    return null;
                                })}
                            </div>
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Product?</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCatalog;
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts } from '../services/api';

const ProductCatalog = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchProducts();
    }, []);

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
            <h1 className="text-3xl font-bold text-white mb-6">Product Catalog</h1>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                {products.length === 0 ? (
                    <p className="text-gray-300">No products found. Add your first product!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-gray-400">Name</th>
                                    <th className="text-left py-3 px-4 text-gray-400">SKU</th>
                                    <th className="text-left py-3 px-4 text-gray-400">Cost</th>
                                    <th className="text-left py-3 px-4 text-gray-400">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="py-3 px-4 text-white">{product.name}</td>
                                        <td className="py-3 px-4 text-gray-400">{product.sku}</td>
                                        <td className="py-3 px-4 text-white">${product.cost}</td>
                                        <td className="py-3 px-4 text-white">{product.currentStock}</td>
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

export default ProductCatalog;
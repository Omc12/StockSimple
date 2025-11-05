import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getStockMovements } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const InventoryLog = () => {
    const { user } = useContext(AuthContext);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const data = await getStockMovements(user.token);
                setMovements(data);
            } catch (error) {
                console.error('Error fetching stock movements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovements();
    }, [user.token]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Inventory Log</h1>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <p className="text-gray-300">Inventory log coming soon...</p>
            </div>
        </div>
    );
};

export default InventoryLog;
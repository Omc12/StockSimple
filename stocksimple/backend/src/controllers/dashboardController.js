const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAlerts = async (req, res) => {
    try {
        // Get all products where current stock is less than or equal to reorder point
        const products = await prisma.product.findMany({
            orderBy: { currentStock: 'asc' },
        });

        // Filter products with low stock
        const lowStockProducts = products.filter(
            product => product.currentStock <= product.reorderPoint
        );

        res.json(lowStockProducts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ 
            message: 'Failed to fetch alerts', 
            error: error.message 
        });
    }
};

module.exports = { getAlerts };
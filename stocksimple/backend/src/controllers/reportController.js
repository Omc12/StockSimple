const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get top and low stock reports
exports.getTopLowStockReports = async (req, res) => {
    try {
        const topProducts = await prisma.product.findMany({
            orderBy: {
                stock: 'desc',
            },
            take: 5,
        });

        const lowProducts = await prisma.product.findMany({
            orderBy: {
                stock: 'asc',
            },
            take: 5,
        });

        res.status(200).json({
            topProducts,
            lowProducts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
};

const getTopLowStock = async (req, res) => {
    try {
        // Get top 5 products with highest stock
        const topStock = await prisma.product.findMany({
            orderBy: { currentStock: 'desc' },
            take: 5,
        });

        // Get top 5 products with lowest stock
        const lowStock = await prisma.product.findMany({
            orderBy: { currentStock: 'asc' },
            take: 5,
        });

        res.json({ topStock, lowStock });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ 
            message: 'Failed to fetch report', 
            error: error.message 
        });
    }
};

module.exports = { getTopLowStock };
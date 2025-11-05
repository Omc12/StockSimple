const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createMovement = async (req, res) => {
    try {
        const { productId, quantity, type, reason } = req.body;
        const userId = req.user.id;

        // Validate product exists
        const product = await prisma.product.findUnique({ 
            where: { id: productId } 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create the movement record
        const movement = await prisma.stockMovement.create({
            data: {
                productId,
                userId,
                quantity: parseInt(quantity),
                type,
                reason: reason || '',
            },
        });

        // Update product stock
        const newStock = type === 'in' 
            ? product.currentStock + parseInt(quantity)
            : product.currentStock - parseInt(quantity);

        await prisma.product.update({
            where: { id: productId },
            data: { currentStock: Math.max(0, newStock) },
        });

        res.status(201).json({
            message: 'Stock movement logged successfully',
            movement,
            newStock: Math.max(0, newStock),
        });
    } catch (error) {
        console.error('Error creating movement:', error);
        res.status(500).json({ 
            message: 'Failed to create movement', 
            error: error.message 
        });
    }
};

const getAllMovements = async (req, res) => {
    try {
        const movements = await prisma.stockMovement.findMany({
            include: {
                product: {
                    select: {
                        name: true,
                        sku: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(movements);
    } catch (error) {
        console.error('Error fetching movements:', error);
        res.status(500).json({ 
            message: 'Failed to fetch movements', 
            error: error.message 
        });
    }
};

module.exports = { createMovement, getAllMovements };
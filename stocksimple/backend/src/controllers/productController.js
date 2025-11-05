const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all products with current stock levels
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' },
        }); // Fetch all products from the database

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            message: 'Failed to fetch products', 
            error: error.message 
        });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            message: 'Failed to fetch product', 
            error: error.message 
        });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, sku, cost, currentStock, reorderPoint } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                cost: parseFloat(cost),
                currentStock: parseInt(currentStock) || 0,
                reorderPoint: parseInt(reorderPoint) || 10,
            },
        }); // Create a new product in the database

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            message: 'Failed to create product', 
            error: error.message 
        });
    }
};

// Update a product's details
const updateProduct = async (req, res) => {
    try {
        const { sku } = req.params;
        const { name, cost, reorderPoint, currentStock } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (cost) updateData.cost = parseFloat(cost);
        if (reorderPoint !== undefined) updateData.reorderPoint = parseInt(reorderPoint);
        if (currentStock !== undefined) updateData.currentStock = parseInt(currentStock);

        const product = await prisma.product.update({
            where: { sku },
            data: updateData,
        }); // Update product in the database

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Failed to update product', 
            error: error.message 
        });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id },
        }); // Delete product from the database

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            message: 'Failed to delete product', 
            error: error.message 
        });
    }
};

module.exports = { 
    getAllProducts, 
    getProductById,
    createProduct, 
    updateProduct,
    deleteProduct 
};
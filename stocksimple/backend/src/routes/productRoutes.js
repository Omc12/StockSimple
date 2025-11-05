const express = require('express');
const { 
    getAllProducts, 
    getProductById,
    createProduct, 
    updateProduct,
    deleteProduct 
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', authMiddleware, getAllProducts);

// Get a product by ID
router.get('/:id', authMiddleware, getProductById);

// Create a new product
router.post('/', authMiddleware, createProduct);

// Update a product by SKU
router.put('/:sku', authMiddleware, updateProduct);

// Delete a product by ID
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
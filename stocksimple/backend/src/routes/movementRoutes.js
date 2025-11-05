const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createMovement, getAllMovements } = require('../controllers/movementController');

const router = express.Router();

// GET /api/movements - Get all stock movements
router.get('/', authMiddleware, getAllMovements);

// POST /api/movements - Create a new stock movement
router.post('/', authMiddleware, createMovement);

module.exports = router;
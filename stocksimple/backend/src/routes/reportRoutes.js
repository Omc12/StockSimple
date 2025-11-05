const express = require('express');
const { getTopLowStock } = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/toplow', authMiddleware, getTopLowStock);

module.exports = router;
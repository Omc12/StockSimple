const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getAlerts } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/alerts', authMiddleware, getAlerts);

module.exports = router;
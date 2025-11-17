const express = require('express');
const { register, login, refresh } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login (fixed path)
router.post('/login', login);

// Route for refreshing tokens
router.post('/refresh', refresh);

module.exports = router;
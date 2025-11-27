const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) =>
  jwt.sign({ userId, type: 'access' }, process.env.JWT_SECRET, { expiresIn: '7d' });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '30d' });

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.type === 'access' ? decoded : null;
  } catch (_) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.type === 'refresh' ? decoded : null;
  } catch (_) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
const { PrismaClient } = require('@prisma/client');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require('../utils/jwtHelper');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Try to persist refresh token if table exists; ignore failures
    try {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
    } catch (_) {}

    res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        token: accessToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Support both hashed passwords (recommended) and legacy plaintext (auto-migrate on success)
    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
        // Likely a bcrypt hash
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Legacy plaintext compare
        isMatch = user.password === password;
        if (isMatch) {
            // Migrate to bcrypt hash transparently
            const newHash = await bcrypt.hash(password, 10);
            try {
                await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
            } catch (_) {
                // If update fails, proceed without blocking login
            }
        }
    }

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    try {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
    } catch (_) {}
    res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        token: accessToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(401).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Best-effort rotation if DB table exists
    try {
        await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.refreshToken.create({ data: { token: newRefreshToken, userId: decoded.userId, expiresAt } });
    } catch (_) {}

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

module.exports = { register, login, refresh };
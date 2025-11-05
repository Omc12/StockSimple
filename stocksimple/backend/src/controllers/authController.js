const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwtHelper');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await prisma.user.create({
        data: {
            email,
            password, // Store plain password (only for learning/demo)
            name,
        },
    });

    const token = generateToken(user.id);

    res.status(201).json({
        message: 'User registered successfully',
        token,
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

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};

module.exports = { register, login };
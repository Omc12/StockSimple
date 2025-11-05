const Joi = require('joi');

const userSignupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const productSchema = Joi.object({
    name: Joi.string().min(1).required(),
    sku: Joi.string().alphanum().required(),
    cost: Joi.number().positive().required(),
});

const stockMovementSchema = Joi.object({
    sku: Joi.string().alphanum().required(),
    quantity: Joi.number().integer().required(),
    reason: Joi.string().optional(),
});

module.exports = {
    userSignupSchema,
    userLoginSchema,
    productSchema,
    stockMovementSchema,
};
import Joi from "joi";

export const addToCartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).optional()
});

export const updateQuantitySchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required()
});
import Joi from "joi";

export const createProductSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).optional(),
    stock: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().required(),
    isFlashSale: Joi.boolean().optional(),
    flashSaleEndDate: Joi.date().optional(),
    isBestSeller: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
    status: Joi.string().valid("active", "inactive").optional()
});

export const updateProductSchema = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    price: Joi.number().min(0).optional(),
    discountPrice: Joi.number().min(0).optional(),
    stock: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().optional(),
    isFlashSale: Joi.boolean().optional(),
    flashSaleEndDate: Joi.date().optional(),
    isBestSeller: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
    status: Joi.string().valid("active", "inactive").optional()
});
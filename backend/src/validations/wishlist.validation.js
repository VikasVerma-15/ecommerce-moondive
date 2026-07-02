import Joi from "joi";

export const addProductToWishlistSchema = Joi.object({
    productId: Joi.string().required()
});

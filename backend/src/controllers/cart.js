import asyncHandler from "../utils/asyncHandler.js";
import { CartService } from "../services/cart.js";
import { ApiResponse } from "../utils/response.js";

const cartService = new CartService();

export const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);
    res.status(200).json(new ApiResponse(200, cart));
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, productId, quantity);
    res.status(200).json(new ApiResponse(200, cart, "Added to cart"));
});

export const updateQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateQuantity(req.user._id, productId, quantity);
    res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

export const removeProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await cartService.removeProduct(req.user._id, productId);
    res.status(200).json(new ApiResponse(200, cart, "Product removed"));
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});

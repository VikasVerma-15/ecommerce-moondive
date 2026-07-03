import asyncHandler from "../utils/asyncHandler.js";
import { WishlistService } from "../services/wishlist.js";
import { ApiResponse } from "../utils/response.js";

const wishlistService = new WishlistService();

export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user._id);   
    res.status(200).json(new ApiResponse(200, wishlist));
});

export const addProduct = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const wishlist = await wishlistService.addProduct(req.user._id, productId);
    res.status(200).json(new ApiResponse(200, wishlist, "Product added to wishlist"));
});

export const removeProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params;
    const wishlist = await wishlistService.removeProduct(req.user._id, productId);
    res.status(200).json(new ApiResponse(200, wishlist, "Product removed from wishlist"));
});

import { WishlistRepository } from '../repositories/wishlist.js';
import AppError from '../utils/apperror.js';

const wishlistRepo = new WishlistRepository();

export class WishlistService {
    async getWishlist(userId) {
        let wishlist = await wishlistRepo.getWishlistByUserId(userId);
        
        // If they don't have a wishlist yet, return an empty one instead of an error
        if (!wishlist) {
            wishlist = { user: userId, products: [] };
        }
        
        return wishlist;
    }

    async addProduct(userId, productId) {
        let wishlist = await wishlistRepo.getWishlistByUserId(userId);
        
        // If the user doesn't have a wishlist document yet, create one
        if (!wishlist) {
            wishlist = await wishlistRepo.createWishlist(userId);
        }

        return await wishlistRepo.addProductToWishlist(wishlist._id, productId);
    }

    async removeProduct(userId, productId) {
        const wishlist = await wishlistRepo.getWishlistByUserId(userId);
        
        if (!wishlist) {
            throw new AppError("Wishlist not found", 404);
        }

        return await wishlistRepo.removeProductFromWishlist(wishlist._id, productId);
    }
}

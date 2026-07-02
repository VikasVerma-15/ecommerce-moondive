import { Wishlist } from "../models/wishlist.model.js";

export class WishlistRepository {
    async getWishlistByUserId(userId) {
        return await Wishlist.findOne({ user: userId }).populate("products");
    }

    async createWishlist(userId) {
        return await Wishlist.create({ user: userId, products: [] });
    }

    async addProductToWishlist(wishlistId, productId) {
        return await Wishlist.findByIdAndUpdate(
            wishlistId,
            { $addToSet: { products: productId } }, // $addToSet prevents duplicates
            { new: true }
        ).populate("products");
    }

    async removeProductFromWishlist(wishlistId, productId) {
        return await Wishlist.findByIdAndUpdate(
            wishlistId,
            { $pull: { products: productId } }, // $pull removes the item from the array
            { new: true }
        ).populate("products");
    }
}

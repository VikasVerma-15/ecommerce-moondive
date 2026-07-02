import { Cart } from "../models/cart.model.js";

export class CartRepository {
    async getCartByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("items.product");
    }

    async createCart(userId) {
        return await Cart.create({ user: userId, items: [] });
    }

    async addItemToCart(cartId, productId, quantity) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $push: { items: { product: productId, quantity } } },
            { new: true }
        ).populate("items.product");
    }

    async updateItemQuantity(cartId, productId, quantity) {
        return await Cart.findOneAndUpdate(
            { _id: cartId, "items.product": productId },
            { $set: { "items.$.quantity": quantity } },
            { new: true }
        ).populate("items.product");
    }

    async incrementItemQuantity(cartId, productId, quantity) {
        return await Cart.findOneAndUpdate(
            { _id: cartId, "items.product": productId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        ).populate("items.product");
    }

    async removeItemFromCart(cartId, productId) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate("items.product");
    }

    async clearCart(cartId) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $set: { items: [] } },
            { new: true }
        );
    }
}

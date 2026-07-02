import { CartRepository } from '../repositories/cart.repository.js';
import AppError from '../utils/apperror.js';

const cartRepo = new CartRepository();

export class CartService {
    async getCart(userId) {
        let cart = await cartRepo.getCartByUserId(userId);
        if (!cart) {
            cart = { user: userId, items: [] };
        }
        return cart;
    }

    async addToCart(userId, productId, quantity = 1) {
        let cart = await cartRepo.getCartByUserId(userId);
        
        if (!cart) {
            cart = await cartRepo.createCart(userId);
        }

        // Check if item already exists in cart
        const itemExists = cart.items.find(item => item.product._id.toString() === productId);

        if (itemExists) {
            // If it exists, just add the new quantity to the existing quantity
            return await cartRepo.incrementItemQuantity(cart._id, productId, quantity);
        } else {
            // Otherwise, add it as a brand new item in the array
            return await cartRepo.addItemToCart(cart._id, productId, quantity);
        }
    }

    async updateQuantity(userId, productId, quantity) {
        const cart = await cartRepo.getCartByUserId(userId);
        if (!cart) throw new AppError("Cart not found", 404);

        if (quantity <= 0) {
            return await cartRepo.removeItemFromCart(cart._id, productId);
        }

        const updatedCart = await cartRepo.updateItemQuantity(cart._id, productId, quantity);
        if (!updatedCart) throw new AppError("Product not found in cart", 404);
        
        return updatedCart;
    }

    async removeProduct(userId, productId) {
        const cart = await cartRepo.getCartByUserId(userId);
        if (!cart) throw new AppError("Cart not found", 404);

        return await cartRepo.removeItemFromCart(cart._id, productId);
    }

    async clearCart(userId) {
        const cart = await cartRepo.getCartByUserId(userId);
        if (!cart) throw new AppError("Cart not found", 404);

        return await cartRepo.clearCart(cart._id);
    }
}

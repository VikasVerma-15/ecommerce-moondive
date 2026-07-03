import { ProductRepository } from '../repositories/product.js';
import AppError from '../utils/apperror.js';

const productRepo = new ProductRepository();

export class ProductService {
    async createProduct(data) {
        return await productRepo.createProduct(data);
    }

    async getAllProducts(query = {}) {
        return await productRepo.getAllProducts(query);
    }

    async getProductById(id) {
        const product = await productRepo.getProductById(id);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        return product;
    }

    async updateProduct(id, data) {
        const product = await productRepo.updateProduct(id, data);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        return product;
    }

    async deleteProduct(id) {
        const deletedProduct = await productRepo.deleteProduct(id);
        if (!deletedProduct) {
            throw new AppError("Product not found", 404);
        }
        return deletedProduct;
    }
}

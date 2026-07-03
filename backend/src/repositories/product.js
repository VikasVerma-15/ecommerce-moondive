import { Product } from "../models/product.js";

export class ProductRepository {
    async createProduct(data) {
        return await Product.create(data);
    }
    
    async getAllProducts(query = {}) {
        return await Product.find(query).populate("category", "name slug");
    }
    
    async getProductById(id) {
        return await Product.findById(id).populate("category", "name slug");
    }
    
    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

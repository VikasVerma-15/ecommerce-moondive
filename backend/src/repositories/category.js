import { Category } from "../models/category.js";

export class CategoryRepository {
    async createCategory(data) {
        return await Category.create(data);
    }
    
    async getAllCategories() {
        return await Category.find();
    }
    
    async getCategoryById(id) {
        return await Category.findById(id);
    }
    
    async getCategoryByName(name) {
        return await Category.findOne({ name });
    }
    
    async updateCategory(id, data) {
        return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    
    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }
}

import { CategoryRepository } from '../repositories/category.js';
import AppError from '../utils/apperror.js';

const categoryRepo = new CategoryRepository();

export class CategoryService {
    async createCategory(data) {
        const { name, image } = data;
        
        // 1. Check if category already exists
        const existingCategory = await categoryRepo.getCategoryByName(name);
        if (existingCategory) {
            throw new AppError("Category with this name already exists", 400);
        }

        // 2. Generate slug from name (e.g. "Smart Phones" -> "smart-phones")
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // 3. Create the category
        return await categoryRepo.createCategory({ name, slug, image });
    }

    async getAllCategories() {
        return await categoryRepo.getAllCategories();
    }

    async getCategoryById(id) {
        const category = await categoryRepo.getCategoryById(id);
        if (!category) {
            throw new AppError("Category not found", 404);
        }
        return category;
    }

    async updateCategory(id, data) {
        // If name is updated, update the slug too
        if (data.name) {
            data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const category = await categoryRepo.updateCategory(id, data);
        if (!category) {
            throw new AppError("Category not found", 404);
        }
        return category;
    }

    async deleteCategory(id) {
        const deletedCategory = await categoryRepo.deleteCategory(id);
        if (!deletedCategory) {
            throw new AppError("Category not found", 404);
        }
        return deletedCategory;
    }
}

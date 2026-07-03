import asyncHandler from "../utils/asyncHandler.js";
import { CategoryService } from "../services/category.js";
import { ApiResponse } from "../utils/response.js";

const categoryService = new CategoryService();

export const createCategory = asyncHandler(async (req, res) => {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(201, newCategory, "Category created successfully"));
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(new ApiResponse(200, categories));
});

export const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(new ApiResponse(200, category));
});

export const updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(200, deletedCategory, "Category deleted successfully"));
});

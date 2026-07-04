import asyncHandler from "../utils/asyncHandler.js";
import { ProductService } from "../services/product.js";
import { ApiResponse } from "../utils/response.js";
import { Category } from "../models/category.js";

const productService = new ProductService();

const resolveCategory = async (categoryInput) => {
    if (!categoryInput) return null;
    
    categoryInput = categoryInput.trim();
    
    // Check if it's already a valid ObjectId (24 hex characters)
    if (categoryInput.match(/^[0-9a-fA-F]{24}$/)) {
        return categoryInput;
    }
    
    // Otherwise, it's a string name. Search for it case-insensitively
    let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryInput}$`, "i") } });
    
    // Auto-create the category if it doesn't exist!
    if (!category) {
        const slug = categoryInput.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        category = await Category.create({ name: categoryInput, slug });
    }
    
    return category._id;
};

export const createProduct = asyncHandler(async (req, res) => {
    if (req.body.category) {
        req.body.category = await resolveCategory(req.body.category);
    }
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
 
    const { isFlashSale, isBestSeller, isNewArrival, category, search } = req.query;
    const query = {};
    if (isFlashSale) query.isFlashSale = isFlashSale === 'true';
    if (isBestSeller) query.isBestSeller = isBestSeller === 'true';
    if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
    if (search) {
        query.title = { $regex: new RegExp(search, "i") };
    }
    if (category) {
        const categoryDoc = await Category.findOne({
            $or: [
                { slug: category },
                { name: { $regex: new RegExp(`^${category}$`, "i") } }
            ]
        });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        } else {
            return res.status(200).json(new ApiResponse(200, []));
        }
    }

    const products = await productService.getAllProducts(query);
    res.status(200).json(new ApiResponse(200, products));
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(new ApiResponse(200, product));
});

export const updateProduct = asyncHandler(async (req, res) => {
    if (req.body.category) {
        req.body.category = await resolveCategory(req.body.category);
    }
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    res.status(200).json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});

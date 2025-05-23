import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    return res.status(202).json(new ApiResponse(202, products, "All products delivered"))
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

	if (!featuredProducts) {
		throw new ApiError(404, "No featured Product found");
	}

    return res.status(202).json(new ApiResponse(202, featuredProducts, "All featured products delivered"))
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
    const {category} = req.params;
    const categoryProducts = await Product.find({ category: category }).lean();

    if (!categoryProducts) {
		throw new ApiError(404, "No Product found in this category");
	}

    return res.status(202).json(new ApiResponse(202, categoryProducts, "All Products in this category are delivered"))
});

export const getRecommendedProducts = asyncHandler(async (req, res) => {
    const products = await Product.aggregate([
        {
            $sample: {size: 4}
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1,
            }
        }
    ])

    return res.status(202).json(new ApiResponse(202, products, "Here are the recommended products"))
});

export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		return res.status(201).json(new ApiResponse(202, product));
});

export const toggleFeaturedProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	product.isFeatured = !product.isFeatured;
	const updatedProduct = await product.save();

	return res
		.status(200)
		.json(new ApiResponse(200, updatedProduct, "Product featured status updated"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		return res.json({ message: "Product deleted successfully" });
});
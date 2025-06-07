import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            success: true,
            message: "All products delivered",
            products: products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ success: false, message: "No featured product found" });
        }

        return res.status(200).json({
            success: true,
            message: "All featured products delivered",
            products: featuredProducts
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const categoryProducts = await Product.find({ category }).lean();

        if (!categoryProducts || categoryProducts.length === 0) {
            return res.status(404).json({ success: false, message: "No products found in this category" });
        }

        return res.status(200).json({
            success: true,
            message: "All products in this category are delivered",
            products: categoryProducts
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Here are the recommended products",
            products: products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url || "",
            category,
        });

        return res.status(201).json({
            success: true,
            products: product
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product featured status updated",
            products: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Deleted image from Cloudinary");
            } catch (error) {
                console.log("Error deleting image from Cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

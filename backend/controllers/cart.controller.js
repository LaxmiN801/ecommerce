import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Product from "../models/product.model.js";

export const getCartProducts = asyncHandler(async (req, res) => {
    const productIds = await req.user.cartItems.map(item => item.product)
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
        return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find(
        (item) => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push({ product: productId });
    }

    await user.save();
    res.json(user.cartItems);
});

export const removeAllFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter(
				(item) => String(item.product) !== String(productId)
			);
		}

		await user.save();
		res.json(user.cartItems);
});

export const updateQuantity = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
	const { quantity } = req.body;
	const user = req.user;

	const existingItem = user.cartItems.find(
		(item) => String(item.product) === String(productId)
	);

    if (!existingItem) {
        throw new ApiError(404, "Product not found")
    }
    if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
            (item) => String(item.product) !== String(productId)
        );
        await user.save();
        return res.json(user.cartItems);
    }

    existingItem.quantity = quantity;
    await user.save();
    res.json(user.cartItems);
});

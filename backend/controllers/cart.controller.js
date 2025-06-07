import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		const productIds = req.user.cartItems.map(item => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => String(cartItem.product) === String(product._id));
			return { ...product.toJSON(), quantity: item.quantity };
		});

		return res.json({
			success: true,
			cartItems: cartItems,
		});
	} catch (error) {
		console.error("Error fetching cart products:", error.message);
		res.status(500).json({ success: false, message: "Failed to fetch cart products" });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			return res.status(400).json({ success: false, message: "Product ID is required" });
		}

		const existingItem = user.cartItems.find(
			(item) => String(item.product) === String(productId)
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		return res.json({
			success: true,
			cartItems: user.cartItems,
		});
	} catch (error) {
		console.error("Error adding to cart:", error.message);
		res.status(500).json({ success: false, message: "Failed to add item to cart" });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
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
		return res.json({
			success: true,
			cartItems: user.cartItems,
		});
	} catch (error) {
		console.error("Error removing from cart:", error.message);
		res.status(500).json({ success: false, message: "Failed to remove items from cart" });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find(
			(item) => String(item.product) === String(productId)
		);

		if (!existingItem) {
			return res.status(404).json({ success: false, message: "Product not found in cart" });
		}

		if (quantity === 0) {
			user.cartItems = user.cartItems.filter(
				(item) => String(item.product) !== String(productId)
			);
		} else {
			existingItem.quantity = quantity;
		}

		await user.save();
		return res.json({
			success: true,
			cartItems: user.cartItems,
		});
	} catch (error) {
		console.error("Error updating cart quantity:", error.message);
		res.status(500).json({ success: false, message: "Failed to update quantity" });
	}
};

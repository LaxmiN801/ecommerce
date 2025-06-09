import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js"
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ success: false, message: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
					{
						coupon: await createStripeCoupon(coupon.discountPercentage),
					},
				]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		return res.status(200).json({
			success: true,
			message: "Checkout session created",
			data: {
				id: session.id,
				totalAmount: totalAmount / 100,
			},
		});
	} catch (error) {
		console.error("Error creating checkout session:", error.message);
		res.status(500).json({ success: false, message: "Checkout session failed" });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;

		const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
		if (existingOrder) {
			console.log("Order already exists for this sessionId:", sessionId);
			return res.status(200).json({
				success: true,
				message: "Order already created",
				orderId: existingOrder._id,
			});
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return res.status(400).json({ success: false, message: "Payment not completed" });
		}

		if (session.metadata.couponCode) {
			await Coupon.findOneAndUpdate(
				{
					code: session.metadata.couponCode,
					userId: session.metadata.userId,
				},
				{ isActive: false }
			);
		}

		const products = JSON.parse(session.metadata.products);

		try {
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			await User.findByIdAndUpdate(session.metadata.userId, {
				$set: { cartItems: [] },
			});

			return res.status(200).json({
				success: true,
				message: "Order successfully created",
				orderId: newOrder._id,
			});
		} catch (dbError) {
			if (dbError.code === 11000) {
				// Duplicate key error — already saved by parallel request
				const existing = await Order.findOne({ stripeSessionId: sessionId });
				return res.status(200).json({
					success: true,
					message: "Order already created",
					orderId: existing._id,
				});
			}
			throw dbError; // Some other DB error
		}
	} catch (error) {
		console.error("Error processing checkout success:", error.message);
		res.status(500).json({ success: false, message: "Failed to process order after payment" });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId,
	});

	await newCoupon.save();
	return newCoupon;
}

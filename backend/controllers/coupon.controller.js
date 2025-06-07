import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

		return res.status(200).json(coupon || null);
	} catch (error) {
		console.error("Error fetching coupon:", error.message);
		res.status(500).json({ message: "Failed to fetch coupon" });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ message: "Coupon code is required" });
		}

		const coupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found or inactive" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(410).json({ message: "Coupon has expired" }); // 410 Gone
		}

		return res.status(200).json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.error("Error validating coupon:", error.message);
		res.status(500).json({ message: "Failed to validate coupon" });
	}
};

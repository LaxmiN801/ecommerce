import Coupon from "../models/coupon.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
	return res.json(coupon || null);
});

export const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
});
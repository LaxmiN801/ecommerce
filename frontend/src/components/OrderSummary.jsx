import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../lib/axios";

const stripePromise = loadStripe("pk_test_51RN63EHJojppKHCMFNcxpGwCAiY6DQyOkRwMUqTNMiBAi0CbjnrONK0BUh7lpde6roYeqvPtYmotSwrk7GKyDYJb00ZVUL58dw");

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axiosInstance.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon && isCouponApplied ? coupon.code : null,
		});

		const session = res.data.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};

	return (
		<motion.div
			className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 shadow-sm sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-xl font-semibold text-emerald-600">Order Summary</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<dl className="flex items-center justify-between gap-4">
						<dt className="text-base text-gray-600">Original Price</dt>
						<dd className="text-base font-medium text-gray-800">${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className="flex items-center justify-between gap-4">
							<dt className="text-base text-gray-600">Savings</dt>
							<dd className="text-base font-medium text-emerald-600">-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className="flex items-center justify-between gap-4">
							<dt className="text-base text-gray-600">Coupon ({coupon.code})</dt>
							<dd className="text-base font-medium text-emerald-600">
								-{coupon.discountPercentage}%
							</dd>
						</dl>
					)}

					<dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
						<dt className="text-base font-bold text-gray-800">Total</dt>
						<dd className="text-base font-bold text-emerald-600">${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className="flex w-full items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className="flex items-center justify-center gap-2">
					<span className="text-sm text-gray-500">or</span>
					<Link
						to="/"
						className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 underline hover:text-emerald-500 hover:no-underline"
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;

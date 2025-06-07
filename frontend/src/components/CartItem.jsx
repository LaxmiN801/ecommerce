import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-md md:p-6">
			<div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
				{/* Image */}
				<div className="shrink-0 md:order-1">
					<img
						className="h-20 w-20 md:h-28 md:w-28 rounded-xl object-cover border border-gray-200"
						src={item.image}
						alt={item.name}
					/>
				</div>

				{/* Quantity and Price */}
				<div className="flex items-center justify-between md:order-3 md:justify-end">
					{/* Quantity buttons */}
					<div className="flex items-center gap-2">
						<button
							className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus className="h-4 w-4 text-gray-700" />
						</button>
						<p className="text-gray-800 font-medium px-2">{item.quantity}</p>
						<button
							className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus className="h-4 w-4 text-gray-700" />
						</button>
					</div>

					{/* Price */}
					<div className="text-end ml-6 md:order-4 md:w-32">
						<p className="text-lg font-semibold text-indigo-600">${item.price}</p>
					</div>
				</div>

				{/* Name + Description + Remove */}
				<div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
					<p className="text-base font-semibold text-gray-800 hover:text-indigo-600 hover:underline transition">
						{item.name}
					</p>
					<p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
					<button
						className="inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400 hover:underline transition"
						onClick={() => removeFromCart(item._id)}
					>
						<Trash size={16} />
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;


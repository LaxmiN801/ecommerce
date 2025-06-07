import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	return (
		<div className="flex flex-col justify-between bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] w-full max-w-xs h-[450px]">
			<div className="relative h-60 w-full overflow-hidden">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover"
				/>
				{product.isFeatured && (
					<span className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-semibold px-2 py-1 rounded z-10">
						Featured
					</span>
				)}
			</div>

			<div className="flex flex-col flex-grow justify-between p-4">
				<h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>

				<p className="text-yellow-500 font-bold text-xl mt-2">${product.price}</p>

				<button
					onClick={handleAddToCart}
					className="mt-4 flex items-center justify-center w-full gap-2 px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-yellow-400 hover:text-gray-900 transition-colors text-sm font-medium"
				>
					<ShoppingCart size={20} />
					Add to Cart
				</button>
			</div>
		</div>

	);
};

export default ProductCard;

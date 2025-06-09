import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prev) => prev + itemsPerPage);
	};
	const prevSlide = () => {
		setCurrentIndex((prev) => prev - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<section className='py-12 bg-gray-100'>
			<div className='text-center mb-8'>
				<h2 className='text-4xl font-extrabold text-gray-800'>Featured Products</h2>
			</div>

			<div className='relative'>
				<div className='overflow-hidden px-4 sm:px-6'>
					<div
						className='flex transition-transform duration-300 ease-in-out'
						style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
					>
						{featuredProducts.map((product) => (
							<div
								key={product._id}
								className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'
							>
								<div className='bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full'>
									<div className='h-48 overflow-hidden'>
										<img
											src={product.image}
											alt={product.name}
											className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
										/>
									</div>
									<div className='flex flex-col flex-grow p-4 justify-between'>
										<div>
											<h3 className='text-lg font-semibold text-gray-800 mb-1 line-clamp-2'>{product.name}</h3>
											<p className='text-yellow-500 font-bold mb-3'>${product.price}</p>
										</div>
										<button
											onClick={() => addToCart(product)}
											className='mt-auto w-full bg-[#0f172a] hover:bg-yellow-400 transition-colors text-white font-semibold py-2 px-4 rounded flex items-center justify-center'
										>
											<ShoppingCart className='w-5 h-5 mr-2' />
											Add to Cart
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Arrows */}
				<button
					onClick={prevSlide}
					disabled={isStartDisabled}
					className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full ${
						isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0f172a] hover:bg-[#1e293b]"
					}`}
				>
					<ChevronLeft className='w-6 h-6 text-white' />
				</button>
				<button
					onClick={nextSlide}
					disabled={isEndDisabled}
					className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full ${
						isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0f172a] hover:bg-[#1e293b]"
					}`}
				>
					<ChevronRight className='w-6 h-6 text-white' />
				</button>
			</div>
		</section>
	);
};

export default FeaturedProducts;

import { useState } from "react";
import { useProductStore } from "../stores/useProductStore.js";
import { Loader } from "lucide-react";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductPage = () => {
	const [productData, setProductData] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	const { createProduct, loading } = useProductStore();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProductData({ ...productData, image: reader.result })
			}
			reader.readAsDataURL(file)
		};
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		createProduct(productData)
	};

	return (
		<div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center bg-gray-200 py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white p-8 rounded-lg shadow-md transition duration-300">
					<h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Create Product</h2>

					<form onSubmit={handleSubmit}>
						<input
							id="name"
							type="text"
							name="name"
							placeholder="Product Name"
							value={productData.name}
							onChange={(e) => setProductData({ ...productData, name: e.target.value })}
							className="w-full mb-4 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
						/>

						<textarea
							id="description"
							name="description"
							placeholder="Description"
							value={productData.description}
							onChange={(e) => setProductData({ ...productData, description: e.target.value })}
							rows={3}
							className="w-full mb-4 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 resize-none"
						/>

						<input
							id="price"
							type="number"
							name="price"
							placeholder="Price"
							value={productData.price}
							onChange={(e) => setProductData({ ...productData, price: e.target.value })}
							className="w-full mb-4 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
						/>

						<select
							id="category"
							name="category"
							value={productData.category}
							onChange={(e) => setProductData({ ...productData, category: e.target.value })}
							className="w-full mb-4 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
						>
							<option value="">Select Category</option>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat.charAt(0).toUpperCase() + cat.slice(1)}
								</option>
							))}
						</select>

						<input
							id="image"
							type="file"
							name="image"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full mb-6 p-2 border border-gray-300 rounded bg-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
						/>

						<button
							id="submit"
							type="submit"
							className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2"
						>
							{loading ? (
								<>
									<Loader className="animate-spin h-4 w-4" />
									<span>Loading...</span>
								</>
							) : (
								"Create Product"
							)}
						</button>

					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateProductPage;

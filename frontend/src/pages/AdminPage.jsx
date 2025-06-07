import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts, products } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className="min-h-[calc(100vh-5rem)] flex flex-col items-center bg-gray-200 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
				<motion.h1
					className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className="flex justify-center mb-6 flex-wrap gap-4">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-transform duration-200 ${activeTab === tab.id
									? "bg-gray-600 text-white hover:scale-[1.02]"
									: "bg-gray-300 text-gray-700 hover:bg-gray-400"
								}`}
						>
							<tab.icon className="w-5 h-5" />
							{tab.label}
						</button>
					))}
				</div>

				<div className="mt-6">
					{activeTab === "create" && <CreateProductForm />}
					{activeTab === "products" && <ProductsList />}
					{activeTab === "analytics" && <AnalyticsTab />}
				</div>
			</div>
		</div>
	);
};

export default AdminPage;

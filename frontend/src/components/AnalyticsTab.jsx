import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axiosInstance.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div className="text-center py-10 text-gray-600">Loading...</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
				<AnalyticsCard
					title="Total Users"
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color="text-emerald-600 bg-white"
					borderColor="border-emerald-500"
				/>
				<AnalyticsCard
					title="Total Products"
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color="text-green-600 bg-white"
					borderColor="border-green-500"
				/>
				<AnalyticsCard
					title="Total Sales"
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color="text-cyan-600 bg-white"
					borderColor="border-cyan-500"
				/>
				<AnalyticsCard
					title="Total Revenue"
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color="text-lime-600 bg-white"
					borderColor="border-lime-500"
				/>
			</div>

			{/* Chart */}
			<motion.div
				className="bg-gray-50 rounded-xl p-6 shadow border border-gray-200"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Sales & Revenue</h2>
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" stroke="#6B7280" />
						<YAxis yAxisId="left" stroke="#6B7280" />
						<YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
						<Tooltip />
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#10B981"
							activeDot={{ r: 6 }}
							name="Sales"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="#3B82F6"
							activeDot={{ r: 6 }}
							name="Revenue"
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color, borderColor }) => (
	<motion.div
		className={`rounded-lg p-5 shadow border-2 ${borderColor} flex flex-col justify-between relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.4 }}
	>
		<div className="z-10">
			<p className="text-sm font-medium text-gray-600">{title}</p>
			<h3 className="text-3xl font-bold mt-1 text-gray-900">{value}</h3>
		</div>
		<div className="absolute -bottom-2 -right-2 opacity-10">
			<Icon className="h-20 w-20" />
		</div>
	</motion.div>
);

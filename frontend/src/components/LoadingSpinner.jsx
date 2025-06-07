const LoadingSpinner = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-200">
			<div className="relative">
				<div className="w-16 h-16 border-2 border-gray-300 rounded-full" />
				<div className="w-16 h-16 border-t-2 border-gray-600 animate-spin rounded-full absolute left-0 top-0" />
				<span className="sr-only">Loading</span>
			</div>
		</div>
	);
};

export default LoadingSpinner;

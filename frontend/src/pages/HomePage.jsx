import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpeg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpeg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpeg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen bg-gray-200 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-4xl sm:text-5xl font-bold text-gray-700 mb-6">
          Explore Our Categories
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!loading && products.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Featured Products
            </h2>
            <FeaturedProducts featuredProducts={products} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

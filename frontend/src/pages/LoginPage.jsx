import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, loading } = useUserStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center bg-gray-200 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-8 rounded-lg shadow-md transition duration-300">
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mb-4 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder:text-gray-400"
                        />

                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full mb-6 p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder:text-gray-400"
                        />

                        <button
                            type="submit"
                            className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-4 w-4" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Create a new account{" "}
                        <Link to="/signup" className="font-medium text-gray-400 hover:text-gray-500">
                            Sign up here <ArrowRight className="inline h-4 w-4" />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

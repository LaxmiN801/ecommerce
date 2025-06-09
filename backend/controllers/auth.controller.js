import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
	return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	};

	res.cookie("accessToken", accessToken, {
		...options,
		maxAge: 15 * 60 * 1000,
	});
	res.cookie("refreshToken", refreshToken, {
		...options,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const signup = async (req, res) => {
	try {
		const { email, password, name } = req.body;

		if (![email, password, name].every(Boolean)) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Invalid email format" });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const user = await User.create({ name, email, password });
		const { accessToken, refreshToken } = generateTokens(user._id);
		setCookies(res, accessToken, refreshToken);

		return res.status(201).json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Signup Error:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user || !(await user.isPasswordCorrect(password))) {
			return res.status(400).json({ success: false, message: "Invalid email or password" });
		}

		const { accessToken, refreshToken } = generateTokens(user._id);
		setCookies(res, accessToken, refreshToken);

		return res.status(200).json({
			success: true,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Login Error:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("Logout Error:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(401).json({ success: false, message: "No refresh token provided" });
		}

		let decoded;
		try {
			decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		} catch (err) {
			return res.status(401).json({ success: false, message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign(
			{ userId: decoded.userId },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "15m" }
		);

		setCookies(res, accessToken, refreshToken);

		return res.status(200).json({
			success: true,
			message: "Access token refreshed",
		});
	} catch (error) {
		console.error("Refresh Token Error:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const getProfile = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ success: false, message: "Unauthorized" });
		}

		return res.status(200).json({
			success: true,
			user: req.user,
		});
	} catch (error) {
		console.error("Get Profile Error:", error.message);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export const signup = asyncHandler(async (req, res) => {
	const { email, password, name } = req.body;

	if (![email, password, name].every(Boolean)) {
		throw new ApiError(400, "All fields are required");
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throw new ApiError(400, "Invalid email format");
	}

	if (password.length < 6) {
		throw new ApiError(400, "Password must be at least 6 characters long");
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new ApiError(400, "User already exists");
	}

	const user = await User.create({ name, email, password });
	const { accessToken, refreshToken } = generateTokens(user._id);
	setCookies(res, accessToken, refreshToken);

	res.status(201).json(
		new ApiResponse(201, {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		})
	);
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ApiError(400, "Email and password are required");
	}

	const user = await User.findOne({ email });
	if (!user || !(await user.isPasswordCorrect(password))) {
		throw new ApiError(401, "Invalid email or password");
	}

	const { accessToken, refreshToken } = generateTokens(user._id);
	setCookies(res, accessToken, refreshToken);

	res.status(200).json(
		new ApiResponse(200, {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		})
	);
});

export const logout = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		throw new ApiError(401, "No refresh token provided");
	}

	const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

	if (!decoded) {
		throw new ApiError(401, "Invalid refresh token");
	}

	const accessToken = jwt.sign(
		{ userId: decoded.userId },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "15m" }
	);

	setCookies(res, accessToken, refreshToken);
	res.status(200).json(new ApiResponse(200, {}, "Access token refreshed"));
});

// Get Profile
export const getProfile = asyncHandler(async (req, res) => {
	if (!req.user) throw new ApiError(401, "Unauthorized");
	res.status(200).json(new ApiResponse(200, req.user));
});

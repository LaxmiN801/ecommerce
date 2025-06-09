import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { protectRoute } from "./middleware/auth.middleware.js";
import cors from "cors"
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json({limit: "10mb"}));
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", protectRoute, cartRoutes);
app.use("/api/coupons", protectRoute, couponRoutes);
app.use("/api/payments", protectRoute, paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/api/test", (req, res) => {
  res.json({ success: true });
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log(err);
})
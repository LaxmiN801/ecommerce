import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { protectRoute } from "./middleware/auth.middleware.js";
import cors from "cors"

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", protectRoute, cartRoutes);
app.use("/api/coupons", protectRoute, couponRoutes);
app.use("/api/payments", protectRoute, paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorMiddleware);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log(err);
})
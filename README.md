# 🛒 MERN E-commerce

A full-stack **E-commerce web application** built with the **MERN stack** and styled using **TailwindCSS**.  
Includes authentication, product & cart management, payments, and admin features.  

---

## 🚀 Features (Assignment Requirements)

### 🔑 Authentication
- JWT-based authentication
- Signup & Login
- Protected routes for users

### 📦 Product APIs (CRUD with Filters)
- Create, Read, Update, Delete products
- Filter by **price** and **categories**
- Images stored via **Cloudinary**

### 🛒 Cart APIs
- Add to cart
- Remove from cart
- Cart persists after logging out

### 🎨 Frontend (React + TailwindCSS)
- Signup/Login page
- Product listing page with filters
- Cart page with add/remove items + persistence
- Professional UI using TailwindCSS
- Global state management using **Zustand**

### 💳 Payment Integration
- Secure payments with **Stripe**

---

## ✨ Bonus Features (Admin)
- Manage products (Add, Update, Delete)
- View all users
- View all orders
- Role-based access (Admin/User)

---

## 📚 Tech Stack
- **Frontend**: React.js, TailwindCSS, Zustand  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  
- **Media Storage**: Cloudinary  
- **Payments**: Stripe  

---

## 📌 How to Run Locally

```bash
# Clone repo
git clone https://github.com/LaxmiN801/ecommerce.git

# Install dependencies
cd ecommerce
npm install

# Run backend
cd server
npm start

# Run frontend
cd client
npm run dev

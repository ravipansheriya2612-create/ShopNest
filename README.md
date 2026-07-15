# ShopNest - Full Stack E-Commerce Product App

ShopNest is a MERN stack e-commerce application developed during my Pluto Academy internship.

The application allows customers to browse products, search and filter items, add products to a shopping cart, complete payments using Razorpay, and view their previous orders. An admin panel is included for managing products with secure authentication and Cloudinary image uploads.

## Features

### Customer

- Browse all available products
- Search products by name
- Filter products by category
- Filter products by maximum price
- Sort products by newest, price and name
- Product detail page
- Shopping cart with quantity management
- Persistent cart using Local Storage
- Razorpay payment integration
- Order history page
- Responsive user interface
- Toast notifications

### Admin

- Secure admin login
- JWT authentication
- Protected admin routes
- Add new products
- Edit existing products
- Delete products
- Upload product images using Cloudinary
- Product stock management

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Context API
- Axios
- React Hot Toast
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Razorpay
- Cloudinary
- CORS
- dotenv

## Project Structure

```text
EcommerceProductApp/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   └── package.json
│
└── README.md
```

## Main Modules

### Customer Module

- Product Catalogue
- Product Search
- Category Filter
- Price Filter
- Product Details
- Shopping Cart
- Checkout
- Razorpay Payment
- Order History

### Admin Module

- Admin Login
- Dashboard
- Add Product
- Edit Product
- Delete Product
- Image Upload
- Stock Management

## Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Admin Routes
- Environment Variables
- Backend Price Validation
- Razorpay Payment Verification

## Future Improvements

- Customer Authentication
- Wishlist
- Product Reviews
- Coupon System
- Order Tracking
- Email Notifications
- Multiple Payment Methods

## Environment Variables

Copy the example environment files before running the project.

### Backend

```bash
cp Backend/.env.example Backend/.env
```

### Frontend

```bash
cp Frontend/.env.example Frontend/.env
```

After copying, update the values according to your local setup.

## Author

**Ravi Pansheriya**

MERN Stack Developer
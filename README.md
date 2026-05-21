# 🛍️ ShopZone — Full Stack E-Commerce App

A modern, full-featured e-commerce platform built with **React**, **Django REST Framework**, and **PostgreSQL**.

![ShopZone](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Django](https://img.shields.io/badge/Django-4.x-green?style=flat-square&logo=django)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## 🌐 Live Demo
**Frontend:** [shopzone.vercel.app](https://shopzone.vercel.app)
**Backend API:** [shopzone-api.onrender.com](https://shopzone-api.onrender.com)

---

## ✨ Features

### 🛒 Shopping
- Product browsing with search, filter, and pagination
- Product detail with image gallery and zoom
- Shopping cart with quantity management
- Coupon/discount code system
- Secure checkout flow

### 👤 User
- JWT authentication — register, login, logout
- Profile management with avatar upload
- Change password
- Wishlist — save favorite products
- Order history and tracking
- Product reviews and ratings

### ⚙️ Admin Panel
- Dashboard with sales analytics
- Product management — add, edit, delete
- Order management — update status
- User management
- Coupon management
- Testimonial approval system
- Sales charts — revenue, orders, top products

### 🎨 UI/UX
- Fully responsive — mobile, tablet, desktop
- Smooth page transitions with Framer Motion
- Loading skeletons
- Toast notifications
- Image lightbox gallery
- Teal color theme

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI Framework |
| Redux Toolkit | State Management |
| React Router v6 | Client Routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | API Calls |
| React Hook Form + Yup | Form Validation |
| Recharts | Admin Charts |
| React Icons | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Django 4 | Web Framework |
| Django REST Framework | REST API |
| Simple JWT | Authentication |
| PostgreSQL | Database |
| Pillow | Image Processing |
| Django CORS Headers | CORS |
| Django Filter | Filtering |
| Cloudinary | Image Storage |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL

# Run dev server
npm run dev
```

---

## 📁 Project Structure
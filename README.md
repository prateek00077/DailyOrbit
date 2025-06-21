# 🌍 DailyOrbit - Goal-Oriented Daily Planner

DailyOrbit is a fully responsive full-stack MERN (MongoDB, Express, React, Node.js) application that helps users create, organize, and track their daily tasks based on personal goals or categories. The app visualizes user progress through interactive charts and provides an intuitive, modern UI experience.

---

## 🚀 Features

- ✅ **User Authentication** (access + refresh token-based system)
- 🗂️ **Create & Manage Categories** (Goals/Sections)
- 📅 **Assign Daily Tasks** to categories
- 📊 **Track Progress** with dynamic progress maps
- 💡 **Minimal & Clean UI** for productivity focus
- 📱 **Fully Responsive Design**

---

## 📦 Tech Stack

### Frontend
- React.js
- TailwindCSS
- TypeScript

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- dotenv for environment config

---


---

## 🔐 Authentication Flow

- On login, the server issues both **access** and **refresh** tokens.
- Access tokens are used for short-lived API access.
- Refresh tokens are stored securely and used to get new access tokens.
- Middleware protects private routes.

---

## 📊 Progress Tracking

Users can track how well they're completing tasks within each category:
- Charts show percentage completion or streaks.
- Useful for building habits and long-term goal management.

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB instance or Atlas cluster

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/prateek00077/DailyOrbit.git
cd DailyOrbit
```

## Made with ❤️ by Prateek Pandey

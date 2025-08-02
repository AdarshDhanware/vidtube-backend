
# 📺 VidTube Backend

VidTube is a scalable, modular, and production-ready backend for a video streaming platform, inspired by modern platforms like YouTube. This project is fully built using the Node.js + Express.js stack with MongoDB as the database. It's designed to handle real-world features like user authentication, video upload, subscriptions, likes/dislikes, and commenting, all while maintaining a clean and organized MVC architecture.

---

## ✨ Core Highlights
- 🔄 Utility-Driven Architecture: Common logic is abstracted into utility classes/functions for cleaner and reusable code.

    - ✅ ApiResponse: standardizes all successful API responses
    - ❌ ApiError: provides structured, consistent error responses with HTTP status codes
    - ⚙️ asyncHandler: a higher-order function that wraps all controller methods to catch async errors and forward them to the global error handler, eliminating repetitive try-catch blocks.

- 📁 Well-defined Folder Structure using MVC pattern:

    - controllers/, models/, routes/, middlewares/, utils/, etc.

---

## 🚀 Features Implemented

The VidTube backend powers all core operations such as:

- 🔐 User authentication & authorization (JWT, cookie-based)
- 🧑‍🤝‍🧑 User management (register, login, logout, profile updates)
- 📼 Video CRUD operations with Multer for file uploads and Cloudinary integration
- 📂 Playlist creation, editing, deletion
- ❤️ Like/Dislike system with per-user toggling logic
- 💬 Comments system (add/delete comments, link them with users and videos)
- 🧾 Subscription system (channel follow/unfollow)
- 📄 Pagination using **mongoose-aggregate-paginate-v2**, essential for handling large datasets.
- 🧰 Utility-Driven Response Flow
- 🧮  Aggregation Pipelines for relational-like data joins across collections (e.g., joining video with uploader, comments with authors).
- 🧹 Environment Configurable, supports .env for safe secret/key injection.

Designed with **clean code practices**, this backend is structured for **scalability**, **reliability**, and **extensibility**, supporting future enhancements like comments, monetization, or live streaming integration.

---

## 🧱 Tech Stack

- **Node.js** – JavaScript runtime environment
- **Express.js** – Minimalist and flexible web framework
- **MongoDB + Mongoose** – NoSQL database with ODM support
- **JWT** – For authentication and access control
- **HTTP-Only Cookies** – Secure storage of tokens
- **Cloudinary Integration** – Used for cloud-based image and video storage, reducing backend storage load and making the application lightweight, scalable, and production-ready.
- **Prettier** – Code formatter for consistent style

---

## 📐 Architecture & Design

The project follows a clean **MVC (Model-View-Controller)** structure:

- `models/` – Defines Mongoose schemas for User, Video, Playlist, etc.
- `controllers/` – Business logic to handle requests & responses
- `routes/` – Organized RESTful API endpoints per module
- `middlewares/` – JWT auth, error handling, validation
- `utils/` – Common utilities, response formatting, error classes
- `db/` – MongoDB connection setup
- `constants.js` – Role definitions, limits, reusable enums

This design pattern ensures:

- ✅ Clean separation of concerns  
- ✅ Easy debugging and testing  
- ✅ Scalable codebase as the application grows

---

## 📁 Project Structure

```text
vidtube-backend/
├── src/
│   ├── controllers/         # Logic for each route (User, Video, Playlist)
│   ├── models/              # Mongoose schemas (User.model.js, Video.model.js, etc.)
│   ├── routes/              # All route definitions
│   ├── middlewares/         # Auth, file uploading, etc.
│   ├── utils/               # Helper functions, API errors, response format
│   ├── db/                  # Database connection (mongoose.connect)
│   ├── index.js             # App entry point (server setup)
│   ├── app.js               # Express app setup (middleware, routes)
│   └── constants.js         # Global constants
├── .env                     # Environment variables
├── .gitignore               # Files/folders to ignore in Git
├── .prettierignore          # Files to ignore from Prettier formatting
├── .prettierrc              # Prettier configuration
├── package.json             # Project dependencies & scripts
├── package-lock.json        # Dependency lock file

```

## 🧠 Features & Implementation Highlights

### 🔄 Authentication System
- Register/Login using secure password hashing (bcrypt)
- JWT-based authentication stored in **HTTP-only cookies**
- Auto-refresh flow (if implemented via refresh tokens)
- Middleware to protect private routes

### 🧠 MongoDB Aggregation Pipelines
- Used extensively to fetch complex data like:
  - User profile with video and playlist counts
  - Subscription list with channel info
  - Admin analytics (total users, video views, etc.)
- `$lookup`, `$match`, `$group`, `$addFields`, and `$project` stages are used to simulate joins and derive statistical insights.

### 📑 Pagination
- All large datasets (videos, playlists, user uploads) are paginated.
- Query params like `page` and `limit` control response size.
- Standardized pagination response format: `data`, `page`, `hasNextPage`, `totalCount`.

### 🎥 Video & Playlist Management
- Users can upload, update, and delete videos
- Playlists allow adding/removing videos dynamically
- Each playlist is linked to the user and videos through references
- Pagination supported for videos within a playlist

### ❤️ Likes, Dislikes & History
- Like/dislike logic prevents multiple reactions from the same user
- Video watch history maintained per user
- Optimized using `$addToSet` and `$pull` operations in MongoDB

---

## 📦 Project Complexity & Scalability

| Aspect               | Description |
|----------------------|-------------|
| 🧩 **Complexity**     | Involves relational-style joins, custom middleware pipelines, multi-layer logic, and dynamic queries. |
| 📈 **Scalability**    | Modular folder structure, stateless APIs, and MongoDB’s performance with aggregation make the project ready for large-scale deployments. |
| 🛡 **Security**       | Utilizes secure cookies, input validation, and route protection. |
| 🔧 **Maintainability**| Easy to extend due to clean file separation, utility-based architecture, and reusable controllers/middlewares. |

---

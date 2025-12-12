🧠 ThoughtBox
A simple social posting platform — Backend + Future React Frontend

ThoughtBox is a micro social platform where users can create posts with images, like/unlike posts, comment, save posts, and manage their profile.
This repository contains:

✔ Backend – Node.js / Express / MongoDB / Cloudinary
✔ Frontend folder – reserved for React (coming later)

🌟 Features
🔐 Authentication

Register & Login

JWT authentication

Password hashing with bcrypt

Protected routes

📝 Posts

Create post (with Cloudinary image upload)

Edit post (title, description, image)

Delete post

Get all posts (with pagination)

Get single post

Get logged-in user’s posts

❤️ Likes

Like / Unlike any post

Get all liked posts

🔖 Saved Posts

Save / Unsave post

View all saved posts

💬 Comments

Add a comment

View all comments on a post

View user’s comments

👤 User Profile

Update username, email, profile picture

Delete account

Get saved posts with user details

Get liked posts with post owner details

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB + Mongoose

Multer

Cloudinary

JWT

BCrypt

Frontend

React (to be added in frontend/ folder)

📁 Folder Structure
ThoughtBox/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── (React app will be added later)
│
└── README.md

🔧 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/AmbeeruRanjith/ThoughtBox.git


OR If you forked:

git clone https://github.com/<your-username>/ThoughtBox.git

⚙️ Backend Setup
2️⃣ Navigate to backend folder
cd ThoughtBox/backend

3️⃣ Install dependencies
npm install

4️⃣ Create .env file

Copy the example:

cp .env.example .env


Then fill values:

MONGO_URI=your_mongodb_url
PORT=5000

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

5️⃣ Start server
npm run dev


Server runs at:

http://localhost:5000

📌 API Overview
🔐 Auth
POST /api/auth/register
POST /api/auth/login

📝 Posts
POST   /api/posts/create
GET    /api/posts?page=1&limit=10
GET    /api/posts/:id
GET    /api/posts/me/myposts
PUT    /api/posts/:id
DELETE /api/posts/:id

PUT /api/posts/:id/like
PUT /api/posts/:id/save

💬 Comments
POST /api/comments/:postId
GET  /api/comments/:postId
GET  /api/comments/user/all

👤 User
PUT    /api/users/update
DELETE /api/users/delete
GET    /api/users/saved
GET    /api/users/liked

🧩 Environment Variables (Included in .env.example)
MONGO_URI=
PORT=5000

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

📝 .gitignore (already included)
node_modules/
.env
logs/
*.log
.vscode/
.idea/
dist/

🤝 Contributing

Fork repository

Create a new branch

Commit changes

Push & create PR

⭐ Support

If you like this project, please star the repository ⭐️ on GitHub!

📄 License

This project is meant for learning and personal use.

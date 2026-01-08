🧠 ThoughtBox
A simple social posting platform — Backend + React (Vite) Frontend

ThoughtBox is a micro social platform where users can create posts with images, like/unlike posts, comment, save posts, and manage their profile.
This repository contains:

✔ Backend – Node.js / Express / MongoDB / Cloudinary
✔ Frontend – React + Vite

🌟 Features
🔐 Authentication
- Register & Login
- JWT authentication
- Password hashing with bcrypt
- Protected routes

📝 Posts
- Create post (with Cloudinary image upload)
- Edit post (title, description, image)
- Delete post
- Get all posts (with pagination)
- Get single post
- Get logged-in user’s posts

❤️ Likes
- Like / Unlike any post
- Get all liked posts

🔖 Saved Posts
- Save / Unsave post
- View all saved posts

💬 Comments
- Add a comment
- View all comments on a post
- View user’s comments

👤 User Profile
- Update username, email, profile picture
- Delete account
- Get saved posts with user details
- Get liked posts with post owner details

🛠 Tech Stack
Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- Cloudinary
- JWT
- BCrypt

Frontend
- React
- Vite

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
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md


🔧 Setup Instructions
1️⃣ Clone the Repository
```bash
git clone https://github.com/AmbeeruRanjith/ThoughtBox.git
cd ThoughtBox
```

⚙️ Backend Setup
2️⃣ Navigate to backend folder
```bash
cd backend
```

3️⃣ Install dependencies
```bash
npm install
```

4️⃣ Create .env file
Copy the example:
```bash
cp .env.example .env
```

Then fill values:
```env
MONGO_URI=your_mongodb_url
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

5️⃣ Start server
```bash
npm run dev
```
Server runs at: http://localhost:5000

�️ Frontend Setup
6️⃣ Navigate to frontend folder
```bash
cd ../frontend
```

7️⃣ Install dependencies
```bash
npm install
```

8️⃣ Start client
```bash
npm run dev
```

📌 API Overview
(See backend documentation or code for details)

🤝 Contributing
- Fork repository
- Create a new branch
- Commit changes
- Push & create PR

⭐ Support
If you like this project, please star the repository ⭐️ on GitHub!

📄 License
This project is meant for learning and personal use.

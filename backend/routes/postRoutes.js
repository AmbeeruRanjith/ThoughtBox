const express = require("express");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleSavePost,
  getPostLikes,
  getFeed
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Create a post
router.post("/create", protect, rateLimiter("post_create"), upload.single("image"), createPost);

// Get all posts (protected)
router.get("/", protect, getAllPosts);

// Get Personalized Feed (Followed users)
router.get("/feed", protect, getFeed);

// Get logged user's posts
router.get("/me/myposts", protect, getMyPosts);

// Get single post
router.get("/:id", protect, getSinglePost);

// Update post (owner only)
router.put("/:id", protect, upload.single("image"), updatePost);

// Delete post (owner only)
router.delete("/:id", protect, deletePost);

// Like / Unlike post
router.put("/:id/like", protect, toggleLikePost);

// Get users who liked a post
router.get("/:id/likes", protect, getPostLikes);

// Save / Unsave post
router.put("/:id/save", protect, toggleSavePost);

module.exports = router;

const express = require("express");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleSavePost
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Create a post
router.post("/create", protect, upload.single("image"), createPost);

// Get all posts (protected)
router.get("/", protect, getAllPosts);

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

// Save / Unsave post
router.put("/:id/save", protect, toggleSavePost);

module.exports = router;

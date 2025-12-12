const express = require("express");
const {
  addComment,
  getCommentsForPost,
  getMyCommentsOnPost
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add comment to a post
router.post("/:postId", protect, addComment);

// Get ALL comments for a post (with user details)
router.get("/:postId", protect, getCommentsForPost);

// Get comments by logged-in user on a specific post
router.get("/:postId/me", protect, getMyCommentsOnPost);

module.exports = router;

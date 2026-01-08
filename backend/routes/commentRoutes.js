const express = require("express");
const {
  addComment,
  getCommentsForPost,
  getMyCommentsOnPost,
  deleteComment
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Add comment to a post
router.post("/:postId", protect, rateLimiter("comment_add"), addComment);

// Get ALL comments for a post (with user details)
router.get("/:postId", protect, getCommentsForPost);

// Get comments by logged-in user on a specific post
router.get("/:postId/me", protect, getMyCommentsOnPost);

// Delete comment
router.delete("/:id", protect, deleteComment);

module.exports = router;

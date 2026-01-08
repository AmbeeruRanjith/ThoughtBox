const express = require("express");
const {
  updateProfile,
  deleteAccount,
  getSavedPosts,
  getLikedPosts,
  getUserProfile,
  followUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// UPDATE PROFILE
router.put("/update", protect, upload.single("profilePic"), updateProfile);

// DELETE ACCOUNT
router.delete("/delete", protect, deleteAccount);

// GET SAVED POSTS
router.get("/saved", protect, getSavedPosts);

// GET LIKED POSTS
router.get("/liked", protect, getLikedPosts);

// GET PUBLIC PROFILE
router.get("/:id", protect, getUserProfile);

// FOLLOW / UNFOLLOW USER
router.put("/:id/follow", protect, followUser);

module.exports = router;

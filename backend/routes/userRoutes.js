const express = require("express");
const {
  updateProfile,
  deleteAccount,
  getSavedPosts,
  getLikedPosts
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

module.exports = router;

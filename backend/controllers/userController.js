const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// =====================================
// UPDATE PROFILE
// PUT /api/user/update
// =====================================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    // If profile picture updated
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "thoughtbox_profile" },
        async (error, uploadResult) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Image upload failed" });
          }

          user.profilePic = uploadResult.secure_url;
          await user.save();

          return res.status(200).json({
            success: true,
            message: "Profile updated",
            user,
          });
        }
      );

      uploadStream.end(req.file.buffer);
      return;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// DELETE USER ACCOUNT
// DELETE /api/user/delete
// =====================================
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user posts
    await Post.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Delete account error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET SAVED POSTS (with post creator)
// GET /api/user/saved
// =====================================
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: { path: "user", select: "username profilePic" } // creator details
    });

    return res.status(200).json({
      success: true,
      savedPosts: user.savedPosts,
    });

  } catch (error) {
    console.error("Get saved posts error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET LIKED POSTS (with post creator)
// GET /api/user/liked
// =====================================
const getLikedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.user._id })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      likedPosts: posts,
    });

  } catch (error) {
    console.error("Get liked posts error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  updateProfile,
  deleteAccount,
  getSavedPosts,
  getLikedPosts
};

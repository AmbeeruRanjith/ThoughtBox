const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const Comment = require("../models/Comment");

// =====================================
// CREATE POST
// =====================================
const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "thoughtbox_posts" },
      async (error, uploadResult) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        const post = await Post.create({
          user: req.user._id,
          title,
          description,
          image: uploadResult.secure_url,
        });

        return res.status(201).json({
          message: "Post created",
          post,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// GET ALL POSTS WITH PAGINATION
// =====================================
const getAllPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const posts = await Post.find(query)
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET LOGGED-IN USER'S POSTS
// =====================================
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("My posts error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET SINGLE POST
// =====================================
const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username profilePic"
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Single post error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// UPDATE POST (ONLY OWNER)
// =====================================
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description } = req.body;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title) post.title = title;
    if (description) post.description = description;

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "thoughtbox_posts" },
        async (error, uploadResult) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Image upload failed" });
          }

          post.image = uploadResult.secure_url;
          await post.save();

          return res.status(200).json({
            message: "Post updated",
            post,
          });
        }
      );

      uploadStream.end(req.file.buffer);
      return;
    }

    await post.save();

    res.status(200).json({ message: "Post updated", post });

  } catch (error) {
    console.error("Update post error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// DELETE POST (ONLY OWNER)
// =====================================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted",
      postId: req.params.id,
    });

  } catch (error) {
    console.error("Delete post error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// LIKE / UNLIKE POST
// =====================================
const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.some(id => id.toString() === userId.toString());

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likeCount -= 1;
    } else {
      post.likes.push(userId);
      post.likeCount += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !isLiked,
      likeCount: post.likeCount,
    });

  } catch (error) {
    console.error("Like/unlike error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// SAVE / UNSAVE POST
// =====================================
const toggleSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.user;

    const isSaved = user.savedPosts.some(id => id.toString() === postId.toString());

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      saved: !isSaved,
      savedPosts: user.savedPosts
    });

  } catch (error) {
    console.error("Save/unsave error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET POST FEED (FOLLOWED USERS)
// =====================================
const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;

    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: { $in: following } })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: { $in: following } });

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (error) {
    console.error("Get feed error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET USERS WHO LIKED A POST
// =====================================
const getPostLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "likes",
      "username profilePic"
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({
      success: true,
      likes: post.likes,
      likeCount: post.likeCount,
    });
  } catch (error) {
    console.error("Get post likes error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleSavePost,
  getPostLikes,
  getFeed,
};

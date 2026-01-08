const Comment = require("../models/Comment");
const Post = require("../models/Post");

// =====================================
// ADD COMMENT TO A POST
// POST /api/comments/:postId
// =====================================
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = await Comment.create({
      post: postId,
      user: req.user._id,
      comment,
    });

    post.commentCount += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment: newComment,
    });

  } catch (error) {
    console.error("Add comment error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET ALL COMMENTS FOR A POST
// GET /api/comments/:postId
// =====================================
const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {
    console.error("Get comments error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// GET ALL COMMENTS OF LOGGED-IN USER ON A SPECIFIC POST
// GET /api/comments/:postId/me
// =====================================
const getMyCommentsOnPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const myComments = await Comment.find({
      post: postId,
      user: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: myComments.length,
      comments: myComments,
    });

  } catch (error) {
    console.error("Get my comments error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// =====================================
// DELETE COMMENT
// DELETE /api/comments/:id
// =====================================
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(comment.post);

    // Allow delete if: User is Comment Owner OR User is Post Owner
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    post.commentCount = Math.max(0, post.commentCount - 1);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });

  } catch (error) {
    console.error("Delete comment error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addComment,
  getCommentsForPost,
  getMyCommentsOnPost,
  deleteComment,
};

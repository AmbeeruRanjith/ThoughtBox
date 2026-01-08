import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaPaperPlane } from "react-icons/fa";

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    const fetchPostAndComments = async () => {
        try {
            const [postRes, commentsRes] = await Promise.all([
                api.get(`/posts/${id}`),
                api.get(`/comments/${id}`)
            ]);
            setPost(postRes.data.post);
            setComments(commentsRes.data.comments);
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await api.post(`/comments/${id}`, { comment: newComment });
            // Add new comment to top of list
            // We manually construct payload roughly or fetch again. 
            // API returns the comment object but populated user might be missing or limited.
            // Easiest is to append locally with current user info
            const addedComment = {
                ...data.comment,
                user: { _id: user._id, username: user.username, profilePic: user.profilePic }
            };
            setComments([addedComment, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Add comment error:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error("Delete comment error:", error);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: "2rem" }}>Loading...</div>;
    if (!post) return <div className="container" style={{ marginTop: "2rem" }}>Post not found</div>;

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${id}`);
            // Force a hard navigation or window location reload if navigate isn't enough, 
            // but standard navigation is better. We need useNavigate hook.
            window.location.href = "/";
        } catch (error) {
            console.error("Delete post error:", error);
        }
    };

    return (
        <div className="container" style={{ marginTop: "2rem", maxWidth: "800px" }}>
            <div style={{ position: "relative" }}>
                <PostCard post={post} />
                {user && user._id === post.user._id && (
                    <button
                        onClick={handleDeletePost}
                        className="btn btn-danger"
                        style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            zIndex: 10,
                            padding: "0.5rem"
                        }}
                    >
                        <FaTrash /> Delete Post
                    </button>
                )}
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Comments</h3>

                {user && (
                    <form onSubmit={handleAddComment} className="flex-between" style={{ gap: "1rem", marginBottom: "2rem" }}>
                        <input
                            type="text"
                            className="input-field"
                            style={{ marginBottom: 0 }}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary"><FaPaperPlane /></button>
                    </form>
                )}

                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment._id} className="comment-item" style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem" }}>
                            <img
                                src={comment.user?.profilePic || "https://via.placeholder.com/40"}
                                alt={comment.user?.username}
                                className="avatar"
                                style={{ width: "32px", height: "32px" }}
                            />
                            <div style={{ flex: 1 }}>
                                <div className="flex-between">
                                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{comment.user?.username || "Unknown"}</span>
                                    {(user?._id === comment.user?._id || user?._id === post.user._id) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            style={{ color: "var(--error)", background: "none" }}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;

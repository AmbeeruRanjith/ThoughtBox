import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment } from "react-icons/fa";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./PostCard.css";

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes || []);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [isSaved, setIsSaved] = useState(user?.savedPosts?.includes(post._id));

    // Check if current user liked the post
    // likes array contains user IDs (strings)
    const isLiked = likes.some(id => id.toString() === user?._id?.toString());

    const handleLike = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/posts/${post._id}/like`);
            setLikeCount(data.likeCount);

            if (data.liked) {
                setLikes([...likes, user._id]);
            } else {
                setLikes(likes.filter(id => id.toString() !== user._id.toString()));
            }
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/posts/${post._id}/save`);
            setIsSaved(data.saved);
            // Update local storage user context if strictly needed, 
            // but usually local state for UI is enough for now.
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    return (
        <div className="card post-card">
            <div className="post-header">
                <Link to={`/profile/${post.user._id}`} className="post-user-info">
                    <img
                        src={post.user.profilePic || "https://via.placeholder.com/40"}
                        alt={post.user.username}
                        className="avatar"
                    />
                    <div>
                        <span className="username">{post.user.username}</span>
                        <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </Link>
            </div>

            <Link to={`/post/${post._id}`} className="post-content-link">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-desc">{post.description.substring(0, 100)}...</p>
                {post.image && (
                    <div className="post-image-container">
                        <img src={post.image} alt={post.title} className="post-image" />
                    </div>
                )}
            </Link>

            <div className="post-actions">
                <button
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likeCount}</span>
                </button>

                <Link to={`/post/${post._id}`} className="action-btn">
                    <FaComment />
                    <span>{post.commentCount || 0}</span>
                </Link>

                {user && (
                    <button
                        className={`action-btn ${isSaved ? 'saved' : ''}`}
                        onClick={handleSave}
                    >
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostCard;

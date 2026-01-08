import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { FaCog } from "react-icons/fa";

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("posts"); // "posts" or "saved"

    // Follow state logic
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        fetchProfile();
        if (activeTab === "saved" && currentUser && currentUser._id === id) {
            fetchSavedPosts();
        }
    }, [id, activeTab]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/user/${id}`);
            setProfile(data.user);
            setPosts(data.posts);
            setFollowersCount(data.user.followers.length);

            if (currentUser) {
                const following = data.user.followers.some(f => f._id === currentUser._id);
                setIsFollowing(following);
            }
        } catch (error) {
            console.error("Profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedPosts = async () => {
        try {
            const { data } = await api.get("/user/saved");
            setSavedPosts(data.savedPosts);
        } catch (error) {
            console.error("Error fetching saved posts:", error);
        }
    };

    const handleFollow = async () => {
        try {
            const { data } = await api.put(`/user/${id}/follow`);
            setIsFollowing(data.following);
            setFollowersCount(data.followersCount);
        } catch (error) {
            console.error("Follow error:", error);
        }
    };

    if (loading && !profile) return <div className="container" style={{ marginTop: "2rem" }}>Loading...</div>;
    if (!profile) return <div className="container" style={{ marginTop: "2rem" }}>User not found</div>;

    const isOwnProfile = currentUser && currentUser._id === profile._id;

    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            {/* Profile Header */}
            <div className="card" style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                <img
                    src={profile.profilePic || "https://via.placeholder.com/150"}
                    alt={profile.username}
                    style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--primary)" }}
                />

                <div style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: "1rem" }}>
                        <h1 style={{ fontSize: "2rem" }}>{profile.username}</h1>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            {isOwnProfile ? (
                                <Link to="/edit-profile" className="btn btn-secondary">
                                    <FaCog /> Edit Profile
                                </Link>
                            ) : (
                                currentUser && (
                                    <button
                                        className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleFollow}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "2rem" }}>
                        <div style={{ textAlign: "center" }}>
                            <strong style={{ display: "block", fontSize: "1.2rem" }}>{posts.length}</strong>
                            <span style={{ color: "var(--text-muted)" }}>Posts</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <strong style={{ display: "block", fontSize: "1.2rem" }}>{followersCount}</strong>
                            <span style={{ color: "var(--text-muted)" }}>Followers</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <strong style={{ display: "block", fontSize: "1.2rem" }}>{profile.following?.length || 0}</strong>
                            <span style={{ color: "var(--text-muted)" }}>Following</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Tabs (Only show Saved if own profile) */}
            <div className="flex-center" style={{ margin: "2rem 0", borderBottom: "1px solid var(--border)" }}>
                <button
                    className={`btn`}
                    style={{
                        background: "transparent",
                        borderBottom: activeTab === "posts" ? "2px solid var(--primary)" : "none",
                        borderRadius: 0,
                        color: activeTab === "posts" ? "var(--primary)" : "var(--text-muted)"
                    }}
                    onClick={() => setActiveTab("posts")}
                >
                    POSTS
                </button>
                {isOwnProfile && (
                    <button
                        className={`btn`}
                        style={{
                            background: "transparent",
                            borderBottom: activeTab === "saved" ? "2px solid var(--primary)" : "none",
                            borderRadius: 0,
                            color: activeTab === "saved" ? "var(--primary)" : "var(--text-muted)"
                        }}
                        onClick={() => setActiveTab("saved")}
                    >
                        SAVED
                    </button>
                )}
            </div>

            {/* Content Grid */}
            {activeTab === "posts" ? (
                <>
                    {posts.length === 0 ? (
                        <p className="flex-center" style={{ color: "var(--text-muted)" }}>No posts yet.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                            {posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {savedPosts.length === 0 ? (
                        <p className="flex-center" style={{ color: "var(--text-muted)" }}>No saved posts.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                            {savedPosts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;

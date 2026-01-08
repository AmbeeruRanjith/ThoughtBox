import React, { useState, useEffect } from "react";
import api from "../utils/api";
import PostCard from "../components/PostCard";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("explore"); // "explore" or "feed"
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, [searchQuery, activeTab]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let endpoint = "/posts";
            if (activeTab === "feed" && user) {
                endpoint = "/posts/feed";
            }

            const params = {};
            if (searchQuery) params.search = searchQuery;

            const { data } = await api.get(endpoint, { params });
            setPosts(data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            {user && !searchQuery && (
                <div className="flex-center" style={{ gap: "1rem", marginBottom: "2rem" }}>
                    <button
                        className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab("explore")}
                    >
                        Global Explore
                    </button>
                    <button
                        className={`btn ${activeTab === 'feed' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab("feed")}
                    >
                        My Feed
                    </button>
                </div>
            )}

            {searchQuery && (
                <h2 style={{ marginBottom: "1.5rem" }}>Search results for "{searchQuery}"</h2>
            )}

            {loading ? (
                <div className="flex-center">Loading...</div>
            ) : (
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    {posts.length === 0 ? (
                        <div className="card" style={{ textAlign: "center" }}>No posts found.</div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;

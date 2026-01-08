import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave } from "react-icons/fa";

const EditProfile = () => {
    const { user, setUser } = useAuth(); // Assuming setUser updates context
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPreview(user.profilePic);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("username", username);
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }

        try {
            const { data } = await api.put("/user/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(data.user); // Update context
            alert("Profile updated!");
            navigate(`/profile/${user._id}`);
        } catch (error) {
            console.error("Update error:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: "2rem", maxWidth: "500px" }}>
            <div className="card">
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    <div className="flex-center" style={{ marginBottom: "2rem", flexDirection: "column", gap: "1rem" }}>
                        <div style={{ position: "relative", width: "120px", height: "120px" }}>
                            <img
                                src={preview || "https://via.placeholder.com/150"}
                                alt="Profile"
                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
                            />
                            <label
                                htmlFor="pic-upload"
                                style={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    background: "var(--primary)",
                                    color: "white",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    border: "2px solid var(--bg-card)"
                                }}
                            >
                                <FaCamera size={14} />
                            </label>
                            <input
                                id="pic-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                </form>

                <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                    <button
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                        onClick={async () => {
                            if (window.confirm("Are you sure? This action cannot be undone!")) {
                                try {
                                    await api.delete("/user/delete");
                                    localStorage.removeItem("token");
                                    window.location.href = "/register";
                                } catch (err) {
                                    alert("Failed to delete account");
                                }
                            }
                        }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

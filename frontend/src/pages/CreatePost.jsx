import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaImage } from "react-icons/fa";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", image);

        try {
            await api.post("/posts/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/");
        } catch (error) {
            console.error("Create post error:", error);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: "2rem", maxWidth: "600px" }}>
            <div className="card">
                <h2 style={{ marginBottom: "1.5rem" }}>Create New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label
                            htmlFor="image-upload"
                            className="btn btn-secondary"
                            style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", gap: "1rem" }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
                            ) : (
                                <>
                                    <FaImage size={40} />
                                    <span>Upload Image</span>
                                </>
                            )}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Title"
                        className="input-field"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="What's on your mind?"
                        className="input-field"
                        style={{ height: "120px", resize: "none" }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Share Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;

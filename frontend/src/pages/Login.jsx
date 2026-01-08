import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: "80vh" }}>
            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Welcome Back</h2>
                {error && <div className="btn-danger" style={{ marginBottom: "1rem", width: "100%" }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                        Login
                    </button>
                </form>
                <p style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--primary)" }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

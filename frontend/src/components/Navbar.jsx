import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaUser, FaPlus, FaSignOutAlt, FaHome } from "react-icons/fa";
import "./Navbar.css"; // We will add specific navbar styles here or in index.css

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${search}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="container flex-between">
                <Link to="/" className="nav-logo">
                    ThoughtBox
                </Link>

                {user && (
                    <form onSubmit={handleSearch} className="search-bar">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit"><FaSearch /></button>
                    </form>
                )}

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/" className="nav-item"><FaHome /> Home</Link>
                            <Link to="/create" className="nav-item btn btn-primary"><FaPlus /> Create</Link>
                            <Link to={`/profile/${user._id}`} className="nav-item"><FaUser /> Profile</Link>
                            <button onClick={logout} className="nav-item btn btn-danger"><FaSignOutAlt /></button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

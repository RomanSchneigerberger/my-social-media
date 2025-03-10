import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './nav.scss';

const Nav = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?query=${searchQuery}`);
		}
	};
	
	return (
		<div className="nav-container">
			<nav className="nav">
				<Link to="/" className="nav-link">🏠 Home</Link>
				<Link to="/profile" className="nav-link">👤 Profile</Link>
				<Link to="/signUp" className="nav-link">🔑 SignUp</Link>
				
				{/* Поисковая форма */}
				<form className="search-form" onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="🔍 Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
					<button type="submit" className="search-button">🔎</button>
				</form>
			</nav>
		</div>
	);
};

export default Nav;

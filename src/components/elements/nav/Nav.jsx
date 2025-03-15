import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './nav.scss';

const Nav = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	
	// ✅ Обработчик поиска (редирект в `Search.jsx`)
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
			setSearchQuery(""); // Очистка поля ввода после редиректа
		}
	};
	
	return (
		<div className="nav-container">
			<nav className="nav">
				<Link to="/feed" className="nav-link">🏠 Home</Link>
				<Link to="/MyProfile" className="nav-link">👤 Profile</Link>
				
				{/* ✅ Форма поиска */}
				<form className="search-form" onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="🔍 Поиск..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
				</form>
			</nav>
		</div>
	);
};

export default Nav;

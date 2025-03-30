import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './nav.scss';

const Nav = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	
	// ✅ Suchverarbeitung (Umleitung zu `Search.jsx`)
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
			setSearchQuery(""); // Leeren des Eingabefeldes nach der Weiterleitung
		}
	};
	
	return (
		<div>
			<div className="nav-container">
			<img className='logoStarta' src="https://static.tildacdn.net/tild3330-3030-4532-b139-376533356465/Group_2136.png" alt=""/>
			<nav className="nav">
				<Link to="/feed" className="nav-link">🏠 Startseite</Link>
				<Link to="/MyProfile" className="nav-link">👤 Profil</Link>
				
				{/* ✅ Suchformular */}
				<form className="search-form" onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="🔍 Suche..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
				</form>
			</nav>
		</div>
		</div>
	);
};

export default Nav;

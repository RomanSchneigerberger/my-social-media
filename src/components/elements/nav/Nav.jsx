import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './nav.scss';

const Nav = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isBurgerOpen, setIsBurgerOpen] = useState(false);
	const navigate = useNavigate();
	
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
			setSearchQuery("");
			setIsBurgerOpen(false);
		}
	};
	
	return (
		<div className="nav-wrapper">
			<div className="nav-container">
				<img className='logoStarta' src="https://static.tildacdn.net/tild3330-3030-4532-b139-376533356465/Group_2136.png" alt="logo"/>
				
				<nav className="nav">
					<Link to="/feed" className="nav-link">🏠 Startseite</Link>
					<Link to="/MyProfile" className="nav-link">👤 Profil</Link>
					
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
				
				{/* Бургер меню для мобилки / планшета */}
				<div className="burger-menu" onClick={() => setIsBurgerOpen(!isBurgerOpen)}>
					<div className="burger-line"></div>
					<div className="burger-line"></div>
					<div className="burger-line"></div>
				</div>
			</div>
			
			{isBurgerOpen && (
				<div className="burger-dropdown">
					<form onSubmit={handleSearch}>
						<input
							type="text"
							placeholder="🔍 Suche..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
					</form>
					<Link to="/feed" onClick={() => setIsBurgerOpen(false)}>Startseite</Link>
					<Link to="/MyProfile" onClick={() => setIsBurgerOpen(false)}>Profil</Link>
					<Link to="/users" onClick={() => setIsBurgerOpen(false)}> Users</Link>
					
					
				</div>
			)}
		</div>
	);
};

export default Nav;

import React, { useState } from 'react';
import Nav from "../../elements/nav/Nav";
import Profile from "../../elements/profile/Profile";
import Post from "../../elements/post/Post";
import './feed.scss';
import User from "../../elements/user/User";
import Weather from "../../elements/Weather/Weather";
import ScrollToTop from "../../../features/scrollToTop/ScrollToTop";

const Feed = () => {
	const [showRight, setShowRight] = useState(false);
	const [showLeft, setShowLeft] = useState(false);
	
	return (
		<div className="Home">
			<header>
				<Nav />
			</header>
			
			<section className="row-layout">
				{/* Левая колонка (профиль) */}
				<div className={`left-column ${showLeft ? "show" : ""}`}>
					<Profile />
				</div>
				
				{/* Центральная колонка */}
				<div className="center-column">
					<Post />
				</div>
				
				{/* Правая колонка (User + Weather) */}
				<div className={`right-column ${showRight ? "show" : ""}`}>
					<User />
					<Weather />
				</div>
				<ScrollToTop />
			</section>
			
			{/* Кнопки для раскрытия на мобильных/планшетах */}
			<div className="toggle-buttons">
				<button className="toggle-left" onClick={() => setShowLeft(!showLeft)}>
					{showLeft ? "👈 Скрыть профиль" : "👉 Показать профиль"}
				</button>
				<button className="toggle-right" onClick={() => setShowRight(!showRight)}>
					{showRight ? "👉 Скрыть инфо" : "👈 Показать инфо"}
				</button>
			</div>
		</div>
	);
};

export default Feed;

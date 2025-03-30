import React from 'react';
import Nav from "../../elements/nav/Nav";
import Profile from "../../elements/profile/Profile";
import Post from "../../elements/post/Post";
import './feed.scss';
import User from "../../elements/user/User";
import Weather from "../../elements/Weather/Weather";
import ScrollToTop from "../../../features/scrollToTop/ScrollToTop";

const Feed = () => {
	
	return (
		<div className="Home">
			<header>
				<Nav/>
			</header>
			<section className="row-layout">
				<div className={`left-column`}>
					<Profile/>
				</div>
				<div className="center-column">
					<Post/>
				</div>
				<div className={`right-column`}>
					<User/>
					<Weather/>
				</div>
				<ScrollToTop/>
			</section>
		</div>
	);
};

export default Feed;

import React from 'react';
import Nav from "../../elements/nav/Nav";
import Profile from "../../elements/profile/Profile";
import Post from "../../elements/post/Post";
import './feed.scss'
import User from "../../elements/user/User";
import Weather from "../../elements/Weather/Weather";

const Feed = () => {
	return (
		<div className="Home">
			<header>
				<Nav/>
			</header>
			<section className="row">
				<Profile/>
				<Post/>
				<User />
				
			</section>
			<footer>
			
			</footer>
		</div>
			);
};

export default Feed;
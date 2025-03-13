import React from 'react';
import Nav from "../../elements/nav/Nav";
import Profile from "../../elements/profile/Profile";
import FolgeIch from "../../elements/folgen/FolgeIch";

const Followings = () => {
	return (
		<div className="Home">
			<header>
				<Nav/>
			</header>
			<section className="row">
				<Profile/>
				<FolgeIch/>
			</section>
			<footer>
			
			</footer>
		</div>
	);
};

export default Followings;
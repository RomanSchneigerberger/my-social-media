import React from 'react';
import Nav from "../nav/Nav";
import Profile from "../profile/Profile";
import FolgeIch from "../folgen/FolgeIch";

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
		</div>
	);
};

export default Followings;
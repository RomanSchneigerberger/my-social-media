import React from 'react';
import Nav from "../nav/Nav";
import Profile from "../profile/Profile";
import FolgenMir from "../folgen/FolgenMir";

const Followers = () => {
	return (
		<div className="Home">
			<header>
				<Nav/>
			</header>
			<section className="row">
				<Profile/>
				<FolgenMir/>
			</section>
		</div>
	);
};

export default Followers;
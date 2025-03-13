import React from 'react';
import Nav from "../../elements/nav/Nav";
import Profile from "../../elements/profile/Profile";
import FolgenMir from "../../elements/folgen/FolgenMir";

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
			<footer>
			
			</footer>
		</div>
	);
};

export default Followers;
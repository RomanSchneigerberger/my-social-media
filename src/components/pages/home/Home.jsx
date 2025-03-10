import React from 'react';
import Profile from '../../elements/profile/Profile';
import Feed from "../feed/Feed";
import Nav from "../../elements/nav/Nav";
import NewPost from "../../elements/newPost/NewPost";

const Home = () => {
	return (
		<div className="Home">
			<Nav/>
			<div>
				<Profile/>
			</div>
			<div>
				<NewPost/>
				<Feed/>
			</div>
		</div>
	);
};

export default Home;
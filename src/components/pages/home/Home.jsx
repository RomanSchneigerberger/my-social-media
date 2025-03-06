import React from 'react';
import Profile from '../../elements/profile/Profile';
import Feed from "../feed/Feed";

const Home = () => {
	return (
		<div>
			<Profile />
			<Feed/>
		</div>
	);
};

export default Home;
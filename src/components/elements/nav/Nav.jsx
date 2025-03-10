import React from 'react';
import {Link} from "react-router-dom";
import './nav.scss'

const Nav = () => {
	return (
		<div className="nav-el">
			<nav className="nav">
				<Link to="/home" > Home</Link>
				<Link to="/profile" > Profile</Link>
				<Link to="/feed" > Feed</Link>
				<Link to="/search" > Serch</Link>
				<Link to="/signUp" > SignUp</Link>
			</nav>
		</div>
	);
};

export default Nav;
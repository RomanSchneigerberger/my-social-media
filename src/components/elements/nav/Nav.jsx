import React from 'react';
import {Link} from "react-router-dom";

const Nav = () => {
	return (
		<div>
			<nav>
				<Link to="/" > Home</Link>
				<Link to="/about" > About</Link>
				<Link to="/contact" > Contact</Link>
				<Link to="/products" > Products</Link>
			</nav>
		</div>
	);
};

export default Nav;
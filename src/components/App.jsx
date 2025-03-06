import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Feed from "./pages/feed/Feed";
import MyProfile from "./pages/myProfile/MyProfile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Home from "./pages/home/Home";
import './app.scss';
import Search from "./pages/search/Search";


const App = () => {
	return (
		<div>
			<BrowserRouter>
				
				<Routes>
					<Route path='/'  index element={<SignIn/>} />
					<Route path='/home'  element={<Home />} />
					<Route path='/signUp'  element={<SignUp />} />
					<Route path='/myProfile' element={<MyProfile />} />
					<Route path='/feed' element={<Feed />} />
					<Route path='/search' element={<Search />} />
					
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Feed from "./pages/feed/Feed";
import MyProfile from "./pages/myProfile/MyProfile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import './app.scss';
import Search from "./pages/search/Search";
import EditProfile from "./elements/editProfile/EditProfile";


const App = () => {
	return (
		<div>
			<BrowserRouter>
				
				<Routes>
					<Route path='/'  index element={<SignIn />} />
					<Route path='/feed'  element={<Feed/>} />
					<Route path='/signUp'  element={<SignUp />} />
					<Route path='/myProfile' element={<MyProfile />} />
					<Route path='/search' element={<Search />} />
					<Route path='/editProfile' element={<EditProfile />} />
					
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import UserProfile from "../components/elements/userProfile/UserProfile";
import Feed from "./pages/feed/Feed";
import MyProfile from "./pages/myProfile/MyProfile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import './app.scss';
import Search from "./pages/search/Search";
import EditProfile from "./elements/editProfile/EditProfile";
import Followings from "./pages/follow/Followings";
import Followers from "./pages/follow/Followers";
import Users from '../components/elements/user/User'
import Transaktionen from "./pages/transaktionen/Transaktionen";

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/'  index element={<SignIn />} />
					<Route path='/feed'  element={<Feed/>} />
					<Route path='/followings'  element={<Followings />} />
					<Route path='/followers'  element={<Followers />} />
					<Route path="/user/:username" element={<UserProfile />} />
					<Route path='/signUp'  element={<SignUp />} />
					<Route path='/myProfile' element={<MyProfile />} />
					<Route path='/search' element={<Search />} />
					<Route path='/editProfile' element={<EditProfile />} />
					<Route path='/users' element={<Users />} />
					<Route path='/transaktionen' element={<Transaktionen />} />
				
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
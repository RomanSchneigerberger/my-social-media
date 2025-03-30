import React, { useEffect } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
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

// const RedirectHandler = () => {
// 	const navigate = useNavigate();
//
// 	useEffect(() => {
// 		const checkToken = () => {
// 			const token = localStorage.getItem("token");
//
// 			if (token) {
// 				try {
// 					const decoded = jwtDecode(token);
// 					const currentTime = Date.now() / 1000;
//
// 					if (decoded.exp && decoded.exp < currentTime) {
// 						// Token ist abgelaufen -> auf "/signIn" weiterleiten
// 						localStorage.removeItem("token");
// 						navigate("/");
// 					} else {
// 						// Token ist gültig -> auf "/feed" weiterleiten
// 						navigate("/feed");
// 					}
// 				} catch (error) {
// 					console.error("Token-Fehler:", error);
// 					localStorage.removeItem("token");
// 					navigate("/");
// 				}
// 			} else {
// 				// Kein Token vorhanden -> auf "/signIn" weiterleiten
// 				navigate("/");
// 			}
// 		};
//
// 		checkToken();
// 	}, [navigate]);
//
// 	return null; // Keine UI, nur Weiterleitung
// };


const App = () => {
	return (
		<div>
			<BrowserRouter>
				{/*<RedirectHandler />*/}
				
				
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
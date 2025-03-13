import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {logoutUser, setUser} from "../../../features/features";
import {useNavigate} from "react-router-dom";
import "./profile.scss";

const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.user);
	const [profileData, setProfileData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (!token) {
			console.warn("Нет токена для авторизации");
			return;
		}
		
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				const data = await response.json();
				setProfileData(data);
				dispatch(setUser({
					user: data._id,
					username: data.username,
				}));
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchProfile();
	}, [token]);
	
	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/signIn");
	};
	
	if (!token) return <div className="error-msg">Пользователь не авторизован</div>;
	if (loading) return <div className="loading">Загрузка...</div>;
	if (error) return <div className="error-msg">Ошибка: {error}</div>;
	if (!profileData) return <div className="error-msg">Нет данных профиля</div>;
	
	return (
		<div className="profile-card col-3">
			<div className="profile-header">
				<img src={profileData.avatar} alt="Avatar" className="profile-avatar"/>
				<h2>{profileData.fullName}</h2>
				<p className="profile-job">Alter {profileData.age}</p>
				<p className="profile-bio">{profileData.bio}</p>
			</div>
			<div className="profile-stats">
				<div><strong>{profileData.posts_count}</strong> Posts</div>
				<div><strong>{profileData.followers}</strong> Follgen mir</div>
				<div><strong>{profileData.following}</strong> Follge ich</div>
			</div>
			<div className="profile-menu">
				<button onClick={() => navigate("/myProfile")}>🤴 Profil</button>
				<button onClick={() => navigate("/feed")}>🏠 Übersicht</button>
				<button onClick={() => navigate("/followers")}>💙 Follgen mir</button>
				<button onClick={() => navigate("/followings")}>❤️️ Follge ich</button>
				<button onClick={() => navigate("/editProfile")}>⚙️ Einstellungen</button>
			</div>
			{/*<button className="profile-view-btn" onClick={() => navigate("/profile")}>View Profile</button>*/}
			<button className="logout-btn" onClick={handleLogout}>Verlassen</button>
			<p className="profile-footer">© {new Date().getFullYear()}. All rights reserved</p>
		</div>
	);
};

export default Profile;

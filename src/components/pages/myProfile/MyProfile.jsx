import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import "./myProfile.scss";
import Nav from "../../elements/nav/Nav";

const MyProfile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.user);
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
				dispatch(setUser({ user: data._id }));
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
	
	if (!token) return <div className="myprofile-error-msg">Пользователь не авторизован</div>;
	if (loading) return <div className="myprofile-loading">Загрузка...</div>;
	if (error) return <div className="myprofile-error-msg">Ошибка: {error}</div>;
	if (!profileData) return <div className="myprofile-error-msg">Нет данных профиля</div>;
	
	return (
		<div>
			<Nav />
			<div className="myprofile-container">
				<div className="myprofile-card">
					<div className="myprofile-header">
						<img src={profileData.avatar} alt="Avatar" className="myprofile-avatar" />
						<h2>{profileData.fullName}</h2>
						<p className="myprofile-username">@{profileData.username}</p>
						<p className="myprofile-bio">{profileData.bio}</p>
						<p>Alter: <strong>{profileData.age}</strong></p>
					</div>
					
					<div className="myprofile-stats">
						<div><strong>${profileData.balance}</strong> Баланс</div>
						<div><strong>{profileData.posts_count}</strong> Постов</div>
						<div><strong>{profileData.followers}</strong> Подписчиков</div>
						<div><strong>{profileData.following}</strong> Подписок</div>
					</div>
					
					<div className="myprofile-buttons">
						<button className="myprofile-back-btn" onClick={() => navigate(-1)}>🔙 Назад</button>
						<button className="myprofile-logout-btn" onClick={handleLogout}>🚪 Выйти</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyProfile;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';

import "./followings.scss";

const FolgeIch = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followings, setFollowings] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token || !username) {
			setError("❌ Ошибка: Токен или пользователь не найден.");
			setLoading(false);
			return;
		}
		
		const fetchFollowings = async () => {
			try {
				console.log(`🔍 Запрос подписок для пользователя: ${username}`);
				
				const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				
				let data = await response.json();
				console.log("📥 ОТВЕТ СЕРВЕРА (followings):", data);
				
				if (data && Array.isArray(data.following)) {
					console.log("✅ Найденные подписки:", data.following);
					setFollowings([...data.following]);
				} else {
					console.warn("⚠️ Сервер вернул некорректные данные или подписок нет.");
					setFollowings([]);
				}
			} catch (err) {
				console.error("❌ Ошибка при получении подписок:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchFollowings();
	}, [token, username]);
	
	// 📌 Получение данных пользователя
	const fetchUserDetails = async (user) => {
		try {
			const response = await fetch(`http://49.13.31.246:9191/user/${user.username}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok) throw new Error("Ошибка загрузки профиля");
			
			const data = await response.json();
			setSelectedUser(data);
		} catch (error) {
			console.error("Ошибка загрузки профиля:", error);
		}
	};
	
	// 📌 Переход к профилю
	const handleUserClick = (user) => {
		navigate(`/user/${user.username}`);
		fetchUserDetails(user);
	};
	
	if (loading) return <div className="loading">⏳ Загрузка...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		<div className="following-list-container">
			<h2>📌 Мои подписки</h2>
			<div className="following-list">
				{followings.length > 0 ? (
					followings.map((follow) => (
						<div key={follow._id} className="following-item" onClick={() => handleUserClick(follow)}>
							<img src={follow.avatar || avatar} alt="Аватар" className="following-avatar" />
							<div className="follower-info">
								<p>@{follow.username}</p>
							</div>
						</div>
					))
				) : (
					<p className="no-followings">Вы пока ни на кого не подписаны</p>
				)}
			</div>
			
			{/* ✅ Карточка пользователя */}
			{selectedUser && (
				<div className="user-card">
					<img src={selectedUser.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
					<h3>{selectedUser.fullName} (@{selectedUser.username})</h3>
					<p><strong>Возраст:</strong> {selectedUser.age}</p>
					<p><strong>О себе:</strong> {selectedUser.bio}</p>
					<p><strong>Баланс:</strong> {selectedUser.balance} 💰</p>
					<p><strong>Постов:</strong> {selectedUser.posts_count}</p>
					<p><strong>Подписчики:</strong> {selectedUser.followers}</p>
					<p><strong>Подписки:</strong> {selectedUser.following}</p>
					<button onClick={() => setSelectedUser(null)}>❌ Закрыть</button>
				</div>
			)}
		</div>
	);
};

export default FolgeIch;

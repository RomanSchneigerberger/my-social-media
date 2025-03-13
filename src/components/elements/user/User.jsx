import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png'
import "./user.scss";

const User = () => {
	const { token, user } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [following, setFollowing] = useState(new Set()); // ✅ Хранит подписки как Set
	
	// 📌 Загружаем пользователей
	useEffect(() => {
		if (!token) {
			setError("❌ Ошибка: Токен не найден.");
			setLoading(false);
			return;
		}
		
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://49.13.31.246:9191/users", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				
				const data = await response.json();
				
				// ✅ Проверяем, есть ли мой ID в followers каждого пользователя
				const myFollowing = new Set();
				data.forEach((u) => {
					if (u.followers && u.followers.some((f) => f.fromUser === user)) {
						myFollowing.add(u.username);
					}
				});
				
				setUsers(data);
				setFollowing(myFollowing); // ✅ Сохраняем подписки
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
	}, [token]);
	
	// 📌 Подписка / Отписка
	const toggleFollow = async (username) => {
		const isFollowing = following.has(username);
		const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
		
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({ username }),
			});
			if (!response.ok) throw new Error(`Ошибка ${isFollowing ? "отписки" : "подписки"}`);
			
			setFollowing((prev) => {
				const updatedSet = new Set(prev);
				if (isFollowing) {
					updatedSet.delete(username);
				} else {
					updatedSet.add(username);
				}
				return updatedSet;
			});
		} catch (err) {
			console.error(err.message);
		}
	};
	
	// 📌 UI обработка ошибок и загрузки
	if (loading) return <div className="loading">⏳ Загрузка...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		<div className="user-list-container col-3 ">
			<h2 className='uberschrift_user'>👥 Все пользователи</h2>
			<div className="user-list">
				{users.map((userItem) => (
					<div key={userItem._id} className="user-item">
						<img src={userItem.avatar || avatar} alt="Аватар" className="user-avatar" />
						<div className="user-info">
							<h4>{userItem.fullName || "Без имени"}</h4>
							<p>@{userItem.username}</p>
						</div>
						<button
							className={`follow-btn ${following.has(userItem.username) ? "following" : ""}`}
							onClick={() => toggleFollow(userItem.username)}
						>
							{following.has(userItem.username) ? "✅ Отписаться" : "Подписаться"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default User;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./followings.scss";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';

const FolgenMir = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followers, setFollowers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate(); // ✅ Для перехода на страницу профиля
	
	useEffect(() => {
		if (!token || !username) {
			setError("❌ Ошибка: Токен или имя пользователя отсутствуют.");
			setLoading(false);
			return;
		}
		
		const fetchFollowers = async () => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/followers/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				
				let data = await response.json();
				console.log("🔍 ОТВЕТ СЕРВЕРА (followers):", data);
				
				// ✅ Теперь берём список подписчиков из `data.followers`
				if (data && Array.isArray(data.followers)) {
					console.log("✅ Нашли подписчиков:", data.followers);
					setFollowers(data.followers);
				} else {
					console.warn("⚠️ Подписчиков нет или формат ответа изменился!");
					setFollowers([]); // Если подписчиков нет
				}
			} catch (err) {
				console.error("❌ Ошибка при получении подписчиков:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchFollowers();
	}, [token, username]);
	
	if (loading) return <div className="followers-loading">⏳ Загрузка...</div>;
	if (error) return <div className="followers-error">{error}</div>;
	
	console.log("✅ Итоговый список подписчиков:", followers);
	
	if (!followers || followers.length === 0) return <div className="followers-empty">❌ Нет подписчиков</div>;
	
	return (
		<div className="followers-container">
			<h2>👥 Подписчики</h2>
			<div className="followers-list">
				{followers.map((follower) => (
					<div key={follower._id} className="follower-card" onClick={() => navigate(`/user/${follower.username}`)}>
						<img src={follower.avatar || avatar} alt="Аватар" className="follower-avatar" />
						<div className="follower-info">
							<p>@{follower.username}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FolgenMir;

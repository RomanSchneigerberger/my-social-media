import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./followings.scss";

const FolgeIch = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followings, setFollowings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
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
				
				// ✅ Проверка: data.following должен быть массивом
				if (data && Array.isArray(data.following)) {
					console.log("✅ Найденные подписки:", data.following);
					setFollowings([...data.following]);  // Принудительно создаем новый массив для ререндера
				} else {
					console.warn("⚠️ Сервер вернул некорректные данные или подписок нет.");
					setFollowings([]); // Очистка списка подписок
				}
			} catch (err) {
				console.error("❌ Ошибка при получении подписок:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchFollowings();
	}, [token, username]); // При изменении токена или пользователя перезапрашиваем
	
	if (loading) return <div className="loading">⏳ Загрузка...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		<div className="following-list-container">
			<h2>📌 Мои подписки</h2>
			<div className="following-list">
				{followings.length > 0 ? (
					followings.map((follow) => (
						<div key={follow._id} className="following-item">
							<img src={follow.avatar || "/default-avatar.png"} alt="Аватар" className="following-avatar" />
							<div className="follower-info">
								{/*<h4>{follow.fullName || "Без имени"}</h4>*/}
								<p>@{follow.username}</p>
							</div>
						</div>
					))
				) : (
					<p className="no-followings">Вы пока ни на кого не подписаны</p>
				)}
			</div>
		</div>
	);
};
export default FolgeIch;

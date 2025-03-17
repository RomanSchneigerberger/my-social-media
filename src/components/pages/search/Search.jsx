import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png";
import "./search.scss";
import Nav from "../../elements/nav/Nav";

const Search = () => {
	const [results, setResults] = useState([]); // Найденные пользователи
	const [following, setFollowing] = useState(new Set()); // Подписки пользователя
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const { token, username } = useSelector((state) => state.user);
	const location = useLocation();
	const navigate = useNavigate();
	
	// ✅ Получаем query-параметр из URL
	const params = new URLSearchParams(location.search);
	const query = params.get("query")?.toLowerCase() || ""; // Игнорируем регистр
	
	// 📌 Загружаем подписки пользователя
	useEffect(() => {
		if (!token) return;
		
		const fetchFollowing = async () => {
			try {
				const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
					headers: { "x-access-token": token },
				});
				const followingSet = new Set(response.data.following.map((u) => u.username));
				setFollowing(followingSet);
			} catch (err) {
				console.error("Ошибка загрузки подписок:", err);
			}
		};
		
		fetchFollowing();
	}, [token, username]);
	
	// 📌 Поиск пользователей (по части имени)
	useEffect(() => {
		if (!query) {
			setResults([]);
			return;
		}
		
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`http://49.13.31.246:9191/users`, {
					headers: { "x-access-token": token },
				});
				
				// 🔹 Фильтруем по части `fullName` или `username`
				const filteredUsers = response.data.filter((user) =>
					user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
				);
				
				setResults(filteredUsers);
			} catch (err) {
				console.error("Ошибка поиска:", err);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
	}, [query, token]);
	
	// 📌 Подписка / Отписка
	const toggleFollow = async (username) => {
		const isFollowing = following.has(username);
		const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
		
		try {
			await axios.post(url, { username }, { headers: { "x-access-token": token } });
			
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
			console.error(`Ошибка ${isFollowing ? "отписки" : "подписки"}:`, err);
		}
	};
	
	// 📌 Переход в профиль пользователя
	const handleUserClick = (user) => {
		navigate(`/user/${user.username}`); // Переход в профиль пользователя
	};
	
	return (
		<div>
			<Nav />
			<div className="search-container">
				<h2>🔍 Результаты поиска: {query}</h2>
				{loading && <p>⏳ Загрузка...</p>}
				{error && <p className="error-msg">{error}</p>}
				{!loading && results.length === 0 && <p>⚠️ Ничего не найдено</p>}
				
				{/* ✅ Список найденных пользователей */}
				<ul className="search-results">
					{results.map((user) => (
						<li key={user._id} onClick={() => handleUserClick(user)}>
							<img src={user.avatar || avatar} alt="Avatar" />
							{user.fullName} (@{user.username})
						</li>
					))}
				</ul>
				
				{/* ✅ Кнопка "Вернуться назад" */}
				<button className="back-to-feed-btn" onClick={() => navigate("/feed")}>⬅ Вернуться в ленту</button>
			</div>
		</div>
	);
};

export default Search;

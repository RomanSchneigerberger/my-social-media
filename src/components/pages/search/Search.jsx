import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./search.scss";

const Search = () => {
	const [results, setResults] = useState([]); // Найденные пользователи
	const [selectedUser, setSelectedUser] = useState(null); // Карточка выбранного пользователя
	const [following, setFollowing] = useState(new Set()); // Подписки пользователя
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const { token, username } = useSelector((state) => state.user);
	const location = useLocation();
	
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
			setSelectedUser(null);
			return;
		}
		
		const fetchUsers = async () => {
			setLoading(true);
			try {
				// 🔹 Загружаем **всех пользователей**
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
	
	// 📌 Открываем карточку пользователя
	const handleUserClick = (user) => {
		setSelectedUser(user);
	};
	
	return (
		<div className="search-container">
			<h2>🔍 Результаты поиска: {query}</h2>
			{loading && <p>⏳ Загрузка...</p>}
			{error && <p className="error-msg">{error}</p>}
			{!loading && results.length === 0 && <p>⚠️ Ничего не найдено</p>}
			
			{/* ✅ Список найденных пользователей */}
			<ul className="search-results">
				{results.map((user) => (
					<li key={user._id} onClick={() => handleUserClick(user)}>
						<img src={user.avatar || "https://via.placeholder.com/40"} alt="Avatar" />
						{user.fullName} (@{user.username})
					</li>
				))}
			</ul>
			
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
					<button
						className={`follow-btn ${following.has(selectedUser.username) ? "following" : ""}`}
						onClick={() => toggleFollow(selectedUser.username)}
					>
						{following.has(selectedUser.username) ? "✅ Отписаться" : "➕ Подписаться"}
					</button>
					<button onClick={() => setSelectedUser(null)}>❌ Закрыть</button>
				</div>
			)}
		</div>
	);
};

export default Search;

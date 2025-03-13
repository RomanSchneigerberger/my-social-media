import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./search.scss";

const Search = () => {
	const [results, setResults] = useState([]); // Список найденных пользователей
	const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const {token} = useSelector((state) => state.user);
	const location = useLocation();
	const navigate = useNavigate();
	
	// ✅ Получаем query-параметр из URL
	const params = new URLSearchParams(location.search);
	const query = params.get("query");
	
	useEffect(() => {
		if (!query || query.trim() === "") {
			setResults([]); // Очищаем список при пустом запросе
			setSelectedUser(null);
			return;
		}
		
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`http://49.13.31.246:9191/user/${query}`, {
					headers: { "x-access-token": token },
				});
				
				// ✅ Проверяем, является ли ответ массивом или объектом
				if (Array.isArray(response.data)) {
					setResults(response.data);
				} else if (typeof response.data === "object" && response.data !== null) {
					setResults([response.data]);
				} else {
					console.error("Ошибка: Сервер вернул неожиданный формат", response.data);
					setResults([]);
				}
			} catch (error) {
				console.error("Ошибка поиска:", error);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
	}, [query, token]);
	
	// 📌 Показываем данные пользователя в карточке
	const handleUserClick = (user) => {
		setSelectedUser(user);
	};
	
	return (
		<div className="search-container">
			<h2>Результаты поиска: {query}</h2>
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
					<button onClick={() => setSelectedUser(null)}>❌ Закрыть</button>
				</div>
			)}
		</div>
	);
};

export default Search;

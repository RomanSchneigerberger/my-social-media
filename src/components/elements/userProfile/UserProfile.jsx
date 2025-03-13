import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png";
import "./userProfile.scss";
import Nav from "../nav/Nav";

const UserProfile = () => {
	const { username: viewedUsername } = useParams();
	const { token, username: myUsername } = useSelector((state) => state.user);
	
	const [userData, setUserData] = useState(null);
	const [userPosts, setUserPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token || !viewedUsername) {
			setError("❌ Ошибка: Токен или имя пользователя отсутствует.");
			setLoading(false);
			return;
		}
		
		const fetchUserData = async () => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/user/${viewedUsername}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				const data = await response.json();
				setUserData(data);
				console.log(data);
				
				// 📌 После загрузки данных пользователя загружаем его посты (по `_id`)
				if (data._id) {
					fetchUserPosts(data._id);
				}
			} catch (err) {
				setError(err.message);
			}
		};
		
		const fetchUserPosts = async (userId) => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/post/${userId}`, { // ✅ Новый эндпоинт
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Ошибка загрузки постов: ${response.status}`);
				
				const data = await response.json();
				setUserPosts(data.reverse());
			} catch (err) {
				console.error("❌ Ошибка загрузки постов:", err.message);
			}
		};
		
		
		const fetchFollowing = async () => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/followings/${myUsername}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error("Ошибка загрузки подписок");
				
				const data = await response.json();
				if (Array.isArray(data.following)) {
					const isUserFollowing = data.following.some((follow) => follow.username === viewedUsername);
					setIsFollowing(isUserFollowing);
				} else {
					setIsFollowing(false);
				}
			} catch (err) {
				console.error("❌ Ошибка при получении подписок:", err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUserData();
		fetchFollowing();
	}, [token, viewedUsername, myUsername]);
	
	const toggleFollow = async () => {
		const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
		
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({ username: viewedUsername }),
			});
			if (!response.ok) throw new Error(`Ошибка ${isFollowing ? "отписки" : "подписки"}`);
			
			setIsFollowing(!isFollowing);
		} catch (err) {
			console.error(err.message);
		}
	};
	
	if (loading) return <div className="one-user-loading">⏳ Загрузка...</div>;
	if (error) return <div className="one-user-error">{error}</div>;
	if (!userData) return <div className="one-user-error">❌ Не удалось загрузить профиль</div>;
	
	return (
		<div>
			<Nav />
		<div className="one-user-container">
			<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Вернуться</button>
			<div className="one-user-card">
				<img src={userData.avatar || avatar} alt="Аватар" className="one-user-avatar" />
				<h2 className="one-user-name">{userData.fullName}</h2>
				<p><strong>Имя пользователя:</strong> @{userData.username}</p>
				<p><strong>Возраст:</strong> {userData.age}</p>
				<p><strong>О себе:</strong> {userData.bio}</p>
				{/*<p><strong>Баланс:</strong> {userData.balance} 💰</p>*/}
				<p><strong>Постов:</strong> {userData.posts_count}</p>
				{/*<p><strong>Подписчики:</strong> {userData.followers?.length || 0}</p>*/}
				{/*<p><strong>Подписки:</strong> {userData.following?.length || 0}</p>*/}
				{viewedUsername !== myUsername && (
					<button className={`one-user-follow-btn ${isFollowing ? "one-user-unfollow" : "one-user-follow"}`} onClick={toggleFollow}>
						{isFollowing ? "Отписаться" : "Подписаться"}
					</button>
				)}
			</div>
			
			{/* ✅ Список постов пользователя */}
			<div className="one-user-posts">
				<h3>📝 Посты пользователя</h3>
				{userPosts.length > 0 ? (
					userPosts.map((post) => (
						<div key={post._id} className="feed-post">
							<div className="post-header">
								<img
									src={userData.avatar || "/default-avatar.png"}
									alt="Аватар"
									className="author-avatar"
								/>
								<span className="author-name">{userData.fullName || userData.username}</span>
							</div>
							{post.title && <h3 className="post-title">{post.title}</h3>}
							{post.description && <p className="post-description">{post.description}</p>}
							{post.image && <img src={post.image} alt="Фото поста" className="post-media" />}
							{post.video && (
								<iframe
									title="Видео поста"
									src={post.video}
									className="post-video"
								></iframe>
							)}
						</div>
					))
				) : (
					<p className="no-posts">❌ У этого пользователя пока нет постов.</p>
				)}
			</div>
		</div>
</div>
	);
};

export default UserProfile;

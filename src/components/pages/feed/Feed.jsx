import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import "./feed.scss";

const Feed = () => {
	const navigate = useNavigate();
	const {token, user} = useSelector((state) => state.user);
	const [feedData, setFeedData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filterOption, setFilterOption] = useState("all");
	const [showScroll, setShowScroll] = useState(false);
	
	useEffect(() => {
		if (!token) {
			console.warn("Нет токена для авторизации");
			return;
		}
		const fetchFeed = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://49.13.31.246:9191/posts", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
				const data = await response.json();
				console.log("posts: ", data);
				setFeedData(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFeed();
	}, [token]);
	
	useEffect(() => {
		const handleScroll = () => {
			setShowScroll(window.scrollY > 300);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	
	
	const handleLike = async (postId) => {
		try {
			const response = await fetch("http://49.13.31.246:9191/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({post_id: postId})
			});
			
			if (!response.ok) throw new Error("Fehler beim Liken eines Beitrags");
			
			// Обновляем только один пост в `feedData`
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? {
							...post,
							likes: [...post.likes, {fromUser: user}]
						}
						: post
				)
			);
		} catch (error) {
			console.error("Fehler:", error);
		}
	};
	
	const deleteLike = async (postId) => {
		try {
			const response = await fetch(`http://49.13.31.246:9191/like/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			
			if (!response.ok) throw new Error("Fehler beim Löschen von Gefällt mir:");
			
			// Удаляем лайк только в нужном посте
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? {
							...post,
							likes: post.likes.filter((like) => like.fromUser !== user)
						}
						: post
				)
			);
		} catch (error) {
			console.error("Fehler beim Löschen von Gefällt mir:", error);
		}
	};
	
	const deletePost = async (postId) => {
		const confirmDelete = window.confirm("Möchten Sie diesen Beitrag wirklich löschen?");
		
		if (!confirmDelete) return; // Если пользователь нажал "Отмена", ничего не делаем
		
		try {
			const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			
			if (!response.ok) throw new Error("Fehler beim Löschen des Beitrags");
			
			// Фильтруем `feedData`, удаляя только этот пост
			setFeedData((prevFeedData) => prevFeedData.filter((post) => post._id !== postId));
			
			alert("✅ Der Beitrag wurde erfolgreich gelöscht!");
		} catch (error) {
			console.error("Fehler beim Löschen des Beitrags:", error);
			alert("❌ Fehler beim Löschen des Beitrags.");
		}
	};
	
	
	const filteredPosts = filterOption === "media"
		? feedData.filter((post) => post.image && post.image.trim() !== "")
		: feedData;
	
	const getPostDate = (post) => {
		if (post.createdAt) return new Date(post.createdAt);
		if (post.created_at) return new Date(post.created_at);
		if (post._id) {
			const timestampHex = post._id.toString().substring(0, 8);
			const timestamp = parseInt(timestampHex, 16);
			return new Date(timestamp * 1000);
		}
		return new Date(0);
	};
	
	const sortedPosts = [...filteredPosts].sort((a, b) => {
		return getPostDate(b) - getPostDate(a);
	});
	
	if (!token) return <div className="error-msg">Der Benutzer ist nicht autorisiert</div>;
	if (loading) return <div className="loading">Laden...</div>;
	if (error) return <div className="error-msg">Fehler: {error}</div>;
	if (!sortedPosts || sortedPosts.length === 0)
		return <div className="error-msg">Es sind keine Beiträge zum Anzeigen vorhanden.</div>;
	
	return (
		<div className="feed-container">
			<div className="feed-controls">
				<div className="feed-filter">
					<label htmlFor="filter">Filter: </label>
					<select
						id="filter"
						value={filterOption}
						onChange={(e) => setFilterOption(e.target.value)}
					>
						<option value="all">Alle Posts</option>
						<option value="media">Nur mit Foto</option>
					</select>
				</div>
			</div>
			<div className="feed-posts">
				{sortedPosts.map((post) => {
					const likesCount = post.likes.length;
					
					return (
						
						<div key={post._id} className="feed-post" data-author={post._id}>
							{post.title && <h3 className="post-title">{post.title}</h3>}
							{post.description && <p className="post-description">{post.description}</p>}
							
							{post.image && (
								<img src={post.image} alt="Post media" className="post-media"/>
							)}
							{post.video && filterOption === "all" && (
								<iframe
									title="Post video"
									src={post.video + "&autoplay=1&mute=1"}
									width="100%"
									height="320"
								></iframe>
							)}
							{post.user && post.user.length > 0 && (
								<div className="post-author">
									<img
										src={post.user[0].avatar || "/default-avatar.png"}
										alt="Author avatar"
										className="author-avatar"
									/>
									<span className="author-name">
										{post.user[0].fullName || post.user[0].username}
										<br/> ❤️️  {likesCount}
									</span>
								</div>
							)}
							<div className="post-likes">
								{
									(post.likes.some(likePerson => likePerson.fromUser === user)) ?
										<button className="like-button" onClick={() => deleteLike(post._id)}>
											❤️ Gefält mir
										</button>
										:
										<button className="like-button" onClick={() => handleLike(post._id)}>
											🤍 Gefält mir
										</button>
								}
								<button className="delete_btn" onClick={() => deletePost(post._id)}>
									🗑
								</button>
							</div>
						</div>
					);
				})}
			</div>
			{showScroll && (
				<button
					className="scroll-to-top"
					onClick={() =>
						window.scrollTo({
							top: 0,
							behavior: "smooth",
						})
					}
				>
					↑
				</button>
			)}
		</div>
	);
};

export default Feed;

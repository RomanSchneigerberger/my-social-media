import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';
import NewPost from "../../elements/newPost/NewPost";
import './post.scss';

const Post = () => {
	const { token, user } = useSelector((state) => state.user);
	const [feedData, setFeedData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fullscreenImage, setFullscreenImage] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token) return;
		
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
				if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
				const data = await response.json();
				
				setFeedData(data.reverse());
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFeed();
	}, [token]);
	
	const handleLike = async (postId) => {
		try {
			const response = await fetch("http://49.13.31.246:9191/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({ post_id: postId }),
			});
			if (!response.ok) throw new Error("Ошибка при лайке");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: [...post.likes, { fromUser: user }] }
						: post
				)
			);
		} catch (error) {
			console.error("Ошибка:", error);
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
			if (!response.ok) throw new Error("Ошибка при удалении лайка");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: post.likes.filter((like) => like.fromUser !== user) }
						: post
				)
			);
		} catch (error) {
			console.error("Ошибка при удалении лайка:", error);
		}
	};
	
	const deletePost = async (postId) => {
		const confirmDelete = window.confirm("Вы уверены, что хотите удалить пост?");
		if (!confirmDelete) return;
		
		try {
			const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok) throw new Error("Ошибка при удалении поста");
			
			setFeedData((prevFeedData) => prevFeedData.filter((post) => post._id !== postId));
		} catch (error) {
			console.error("Ошибка при удалении поста:", error);
		}
	};
	
	return (
		<div className="col-6">
			<NewPost />
			<div className="feed-container">
				<div className="feed-posts">
					{feedData.map((post) => (
						<div key={post._id} className="feed-post">
							{/* ✅ Верхняя часть: Автор */}
							<div className="post-header">
								<div className="author-info" onClick={() => navigate(`/user/${post.user[0].username}`)}>
									<img src={post.user[0].avatar || avatar} alt="Аватар автора" className="author-avatar" />
									<span className="author-name">{post.user[0].fullName || post.user[0].username}</span>
								</div>
							</div>
							
							{/* ✅ Контент поста */}
							{post.title && <h3 className="post-title">{post.title}</h3>}
							{post.description && <p className="post-description">{post.description}</p>}
							{post.image && (
								<img
									src={post.image}
									alt="Фото поста"
									className="post-media"
									onClick={() => setFullscreenImage(post.image)}
								/>
							)}
							
							{/* ✅ Лайки + Кнопки */}
							<div className="post-actions">
								<button
									className="like-button"
									onClick={() =>
										post.likes.some((like) => like.fromUser === user)
											? deleteLike(post._id)
											: handleLike(post._id)
									}
								>
									{post.likes.some((like) => like.fromUser === user) ? "❤️" : "🤍"} {post.likes.length}
								</button>
								<button className="delete-button" onClick={() => deletePost(post._id)}>🗑</button>
							</div>
						</div>
					))}
				</div>
			</div>
			
			{/* ✅ Окно увеличенного изображения */}
			{fullscreenImage && (
				<div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
					<img src={fullscreenImage} alt="Увеличенное изображение" />
				</div>
			)}
		</div>
	);
};

export default Post;

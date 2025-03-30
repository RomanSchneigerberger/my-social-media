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
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
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
			if (!response.ok) throw new Error("Fehler beim Liken");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: [...post.likes, { fromUser: user }] }
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
			if (!response.ok) throw new Error("Fehler beim Entfernen des Likes");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: post.likes.filter((like) => like.fromUser !== user) }
						: post
				)
			);
		} catch (error) {
			console.error("Fehler beim Entfernen des Likes:", error);
		}
	};
	
	const deletePost = async (postId) => {
		const confirmDelete = window.confirm("Sind Sie sicher, dass Sie diesen Beitrag löschen möchten?");
		if (!confirmDelete) return;
		
		try {
			const response = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok) throw new Error("Fehler beim Löschen des Beitrags");
			
			setFeedData((prevFeedData) => prevFeedData.filter((post) => post._id !== postId));
		} catch (error) {
			console.error("Fehler beim Löschen des Beitrags:", error);
		}
	};
	
	// 🔥 Funktion zum Abrufen der YouTube-Einbettungs-URL
	const getYouTubeEmbedUrl = (url) => {
		const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
	};
	
	return (
		<div className="col-6">
			<NewPost />
			<div className="feed-container">
				<div className="feed-posts">
					{feedData.map((post) => (
						<div key={post._id} className="feed-post">
							{/* ✅ Autor-Bereich */}
							<div className="post-header">
								<div className="author-info" onClick={() => navigate(`/user/${post.user[0].username}`)}>
									<img src={post.user[0].avatar || avatar} alt="Avatar des Autors" className="author-avatar" />
									<span className="author-name">{post.user[0].fullName || post.user[0].username}</span>
								</div>
							</div>
							
							{/* ✅ Post-Inhalt */}
							{post.title && <h3 className="post-title">{post.title}</h3>}
							{post.description && <p style={{whiteSpace: "pre-wrap"}} className="post-description">{post.description}</p>}
							
							{/* ✅ Anzeige von Fotos und Videos */}
							{post.image && (
								<img
									src={post.image}
									alt="Foto des Beitrags"
									className="post-media"
									onClick={() => setFullscreenImage(post.image)}
								/>
							)}
							
							{/* ✅ YouTube-Video Einbettung */}
							{post.video && getYouTubeEmbedUrl(post.video) ? (
								<div className="post-video-container">
									<iframe
										className="post-video"
										src={getYouTubeEmbedUrl(post.video)}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										title="YouTube video"
									></iframe>
								</div>
							) : post.video ? (
								<a href={post.video} target="_blank" rel="noopener noreferrer">
									📺 Video ansehen
								</a>
							) : null}
							
							{/* ✅ Likes + Aktionen */}
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
			
			{/* ✅ Vollbild-Bildanzeige */}
			{fullscreenImage && (
				<div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
					<img src={fullscreenImage} alt="Vergrößertes Bild" />
				</div>
			)}
		</div>
	);
};

export default Post;

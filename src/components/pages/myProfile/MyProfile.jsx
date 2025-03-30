import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {logoutUser, setUser} from "../../../features/features";
import {useNavigate} from "react-router-dom";
import "./myProfile.scss";
import Nav from "../../elements/nav/Nav";
import ScrollToTop from "../../../features/scrollToTop/ScrollToTop";

const MyProfile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.user);
	const [profileData, setProfileData] = useState(null);
	const [userPosts, setUserPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fullscreenImage, setFullscreenImage] = useState(null);
	
	useEffect(() => {
		if (!token) return;
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const res = await fetch("http://49.13.31.246:9191/me", {
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!res.ok) throw new Error(`Fehler: ${res.status}`);
				const data = await res.json();
				setProfileData(data);
				dispatch(setUser({user: data._id}));
				if (data._id) fetchUserPosts(data._id);
			} catch (err) {
				setError(err.message);
				navigate("/");
			} finally {
				setLoading(false);
			}
		};
		
		const fetchUserPosts = async (userId) => {
			try {
				const res = await fetch(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!res.ok) throw new Error("Fehler beim Laden der Beiträge");
				const data = await res.json();
				setUserPosts(data.reverse());
			} catch (err) {
				console.error("Fehler beim Laden der Beiträge:", err.message);
			}
		};
		fetchProfile();
	}, [token, dispatch, navigate]);
	
	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/");
	};
	
	const getYouTubeEmbedUrl = (url) => {
		const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
	};
	
	const deletePost = async (postId) => {
		const confirm = window.confirm("Beitrag wirklich löschen?");
		if (!confirm) return;
		try {
			const res = await fetch(`http://49.13.31.246:9191/post/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!res.ok) throw new Error("Fehler beim Löschen");
			setUserPosts((prev) => prev.filter((post) => post._id !== postId));
		} catch (err) {
			console.error(err.message);
		}
	};
	
	if (!token) return <div className="myprofile-error-msg">Nicht autorisiert</div>;
	if (loading) return <div className="myprofile-loading">Lädt...</div>;
	if (error) return <div className="myprofile-error-msg">Fehler: {error}</div>;
	if (!profileData) return <div className="myprofile-error-msg">Keine Daten</div>;
	
	return (
		<div>
			<Nav/>
			<div className="myprofile-container">
				<div className="myprofile-card">
					<div className="myprofile-header">
						<img src={profileData.avatar} alt="Avatar" className="myprofile-avatar"/>
						<h2>{profileData.fullName}</h2>
						<p className="myprofile-username">@{profileData.username}</p>
						<p className="myprofile-bio">{profileData.bio}</p>
						<p>Alter: <strong>{profileData.age}</strong></p>
					</div>
					<div className="myprofile-stats">
						<div><strong>${profileData.balance}</strong> Guthaben</div>
						<div><strong>{profileData.posts_count}</strong> Beiträge</div>
						<div><strong>{profileData.followers}</strong> Follower</div>
						<div><strong>{profileData.following}</strong> Abonniert</div>
					</div>
					<div className="myprofile-buttons">
						<button className="myprofile-logout-btn" onClick={handleLogout}>🚪 Abmelden</button>
						<button className="myprofile-edit-btn" onClick={() => navigate("/editProfile")}>Bearbeiten
						</button>
					</div>
					<button className="one-user-back-btn" onClick={() => navigate("/feed")}>⬅ Zurück</button>
				</div>
				<div className="myprofile-posts">
					{userPosts.map((post) => (
						<div key={post._id} className="post-card">
							{post.title && <h4 className="post-title">{post.title}</h4>}
							{post.description && <p className="post-description">{post.description}</p>}
							{post.image && (
								<img
									src={post.image}
									alt="Bild"
									className="post-image"
									onClick={() => setFullscreenImage(post.image)}
								/>
							)}
							{post.video && getYouTubeEmbedUrl(post.video) && (
								<iframe
									src={getYouTubeEmbedUrl(post.video)}
									title="Video"
									className="post-video"
									allowFullScreen
								/>
							)}
							<div className="post-actions">
								<button
									className="delete-button"
									onClick={() => deletePost(post._id)}
									title="Beitrag löschen"
								>
									🗑 Beitrag löschen
								</button>
							</div>
						</div>
					))}
				</div>
				{fullscreenImage && (
					<div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
						<img src={fullscreenImage} alt="Vollbild"/>
					</div>
				)}
			</div>
			<ScrollToTop/>
		</div>
	);
};

export default MyProfile;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import "./myProfile.scss";
import Nav from "../../elements/nav/Nav";

const MyProfile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { token, user } = useSelector((state) => state.user);
	const [profileData, setProfileData] = useState(null);
	const [userPosts, setUserPosts] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fullscreenImage, setFullscreenImage] = useState(null);
	
	useEffect(() => {
		if (!token) {
			console.warn("Kein Token zur Authentifizierung gefunden.");
			return;
		}
		
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
				const data = await response.json();
				setProfileData(data);
				dispatch(setUser({ user: data._id }));
				
				if (data._id) {
					fetchUserPosts(data._id);
				}
			} catch (err) {
				setError(err.message);
				navigate("/");
			} finally {
				setLoading(false);
			}
		};
		
		const fetchUserPosts = async (userId) => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error("Fehler beim Laden der Beiträge");
				const data = await response.json();
				setUserPosts(data.reverse());
			} catch (err) {
				console.error("Fehler beim Laden der Beiträge:", err.message);
			}
		};
		
		fetchProfile();
	}, [token]);
	
	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/");
	};
	
	const getYouTubeEmbedUrl = (url) => {
		const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
	};
	
	if (!token) return <div className="myprofile-error-msg">Benutzer ist nicht autorisiert</div>;
	if (loading) return <div className="myprofile-loading">Laden...</div>;
	if (error) return <div className="myprofile-error-msg">Fehler: {error}</div>;
	if (!profileData) return <div className="myprofile-error-msg">Keine Profildaten gefunden</div>;
	
	return (
		<div>
			<Nav />
			<div className="myprofile-container">
				<div className="myprofile-card">
					<div className="myprofile-header">
						<img src={profileData.avatar} alt="Avatar" className="myprofile-avatar" />
						<h2>{profileData.fullName}</h2>
						<p className="myprofile-username">@{profileData.username}</p>
						<p style={{ whiteSpace: "pre-wrap" }} className="myprofile-bio">{profileData.bio}</p>
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
					</div>
				</div>
				
				<div className="myprofile-posts">
					{userPosts.map((post) => (
						<div key={post._id} className="post-card">
							{post.title && <h4>{post.title}</h4>}
							{post.description && <p>{post.description}</p>}
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
						</div>
					))}
				</div>
				
				{fullscreenImage && (
					<div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
						<img src={fullscreenImage} alt="Vollbild" />
					</div>
				)}
			</div>
		</div>
	);
};

export default MyProfile;

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
			setError("❌ Fehler: Token oder Benutzername fehlt.");
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
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
				const data = await response.json();
				setUserData(data);
				console.log(data);
				
				if (data._id) {
					fetchUserPosts(data._id);
				}
			} catch (err) {
				setError(err.message);
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
				if (!response.ok) new Error(`Fehler beim Laden der Beiträge: ${response.status}`);
				
				const data = await response.json();
				setUserPosts(data.reverse());
			} catch (err) {
				console.error("❌ Fehler beim Laden der Beiträge:", err.message);
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
				if (!response.ok) throw new Error("Fehler beim Laden der Abonnements");
				
				const data = await response.json();
				if (Array.isArray(data.following)) {
					const isUserFollowing = data.following.some((follow) => follow.username === viewedUsername);
					setIsFollowing(isUserFollowing);
				} else {
					setIsFollowing(false);
				}
			} catch (err) {
				console.error("❌ Fehler beim Abrufen der Abonnements:", err.message);
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
			if (!response.ok) throw new Error(`Fehler bei ${isFollowing ? "Entfernen" : "Folgen"}`);
			
			setIsFollowing(!isFollowing);
		} catch (err) {
			console.error(err.message);
		}
	};
	
	if (loading) return <div className="one-user-loading">⏳ Laden...</div>;
	if (error) return <div className="one-user-error">{error}</div>;
	if (!userData) return <div className="one-user-error">❌ Benutzerprofil konnte nicht geladen werden</div>;
	
	return (
		<div>
			<Nav />
			<div className="one-user-container">
				<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
				<div className="one-user-card">
					<img src={userData.avatar || avatar} alt="Avatar" className="one-user-avatar" />
					<h2 className="one-user-name">{userData.fullName}</h2>
					<p><strong>Benutzername:</strong> <br/>@{userData.username}</p>
					<p><strong>Alter:</strong> {userData.age}</p>
					<p style={{whiteSpace: "pre-wrap"}}><strong>Über mich:</strong> <br/>{userData.bio}</p>
					<p><strong>Beiträge:</strong> {userData.posts_count}</p>
					{viewedUsername !== myUsername && (
						<button className={`one-user-follow-btn ${isFollowing ? "one-user-unfollow" : "one-user-follow"}`} onClick={toggleFollow}>
							{isFollowing ? "Entfernen" : "Folgen"}
						</button>
					)}
				</div>
				
				<div className="one-user-posts">
					<h3>📝 Beiträge des Benutzers</h3>
					{userPosts.length > 0 ? (
						userPosts.map((post) => (
							<div key={post._id} className="feed-post">
								<div className="post-header">
									<img
										src={userData.avatar || "/default-avatar.png"}
										alt="Avatar"
										className="author-avatar"
									/>
									<span className="author-name">{userData.fullName || userData.username}</span>
								</div>
								{post.title && <h3 className="post-title">{post.title}</h3>}
								{post.description && <p className="post-description">{post.description}</p>}
								{post.image && <img src={post.image} alt="Beitragsbild" className="post-media" />}
								{post.video && (
									<iframe
										title="Beitragsvideo"
										src={post.video}
										className="post-video"
									></iframe>
								)}
							</div>
						))
					) : (
						<p className="no-posts">❌ Dieser Benutzer hat noch keine Beiträge.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;

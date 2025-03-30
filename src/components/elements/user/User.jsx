import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';
import "./user.scss";

const User = () => {
	const {token, username} = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [following, setFollowing] = useState(new Set());
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token) {
			setError("❌ Fehler: Token nicht gefunden.");
			setLoading(false);
			return;
		}
		
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://49.13.31.246:9191/users", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) new Error(`Fehler: ${response.status}`);
				
				const data = await response.json();
				const filteredUsers = data.filter(user => user.username !== username);
				setUsers(filteredUsers);
			} catch (err) {
				setError(err.message);
			}
		};
		
		const fetchMyFollowing = async () => {
			try {
				const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok)new Error("Fehler beim Laden der Abonnements");
				
				const data = await response.json();
				const myFollowing = new Set(data.following.map((u) => u.username));
				setFollowing(myFollowing);
			} catch (err) {
				console.error("❌ Fehler beim Laden der Abonnements:", err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
		fetchMyFollowing();
	}, [token, username]);
	
	const toggleFollow = async (userToFollow) => {
		const isFollowing = following.has(userToFollow);
		const url = `http://49.13.31.246:9191/${isFollowing ? "unfollow" : "follow"}`;
		
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({username: userToFollow}),
			});
			if (!response.ok) new Error(`Fehler bei ${isFollowing ? "Entfernen" : "Abonnieren"}`);
			
			setFollowing((prev) => {
				const updatedSet = new Set(prev);
				if (isFollowing) {
					updatedSet.delete(userToFollow);
				} else {
					updatedSet.add(userToFollow);
				}
				return updatedSet;
			});
		} catch (err) {
			console.error("❌ Fehler beim Abonnieren/Entfernen:", err.message);
		}
	};
	
	if (loading) return <div className="loading">⏳ Laden...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		
		<div className="user-list-container">
			<h2 className="uberschrift_user">Alle Benutzer</h2>
			<div className="user-list">
				{users.map((userItem) => (
					<div key={userItem._id} className="user-item">
						<div className="user-info" onClick={() => navigate(`/user/${userItem.username}`)}>
							<img src={userItem.avatar || avatar} alt="Avatar" className="user-avatar"/>
							<div className="user-text">
								<h4>{userItem.fullName || "Ohne Name"}</h4>
								<p>@{userItem.username}</p>
							</div>
						</div>
						
						<button
							className={`follow-btn ${following.has(userItem.username) ? "following" : "delete"}`}
							onClick={() => toggleFollow(userItem.username)}
						>
							{following.has(userItem.username) ? "👥" : "＋"}
						</button>
					</div>
				))}
			</div>
			{window.innerWidth <= 1024 && (
				<button className="back-btn-mobile" onClick={() => navigate(-1)}>
					⬅ Zurück
				</button>
			)}
		</div>
	);
};

export default User;

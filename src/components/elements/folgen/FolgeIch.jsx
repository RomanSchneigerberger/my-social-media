import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../images/png-transparent-default-avatar-thumbnail.png';

import "./followings.scss";

const FolgeIch = () => {
	const { token, username } = useSelector((state) => state.user);
	const [followings, setFollowings] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null); // Gewählter Benutzer
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token || !username) {
			setError("❌ Fehler: Token oder Benutzer nicht gefunden.");
			setLoading(false);
			return;
		}
		
		const fetchFollowings = async () => {
			try {
				console.log(`🔍 Abrufen von Abonnements für Benutzer: ${username}`);
				
				const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				
				if (!response.ok) new Error(`Fehler: ${response.status}`);
				
				let data = await response.json();
				console.log("📥 SERVER ANTWORT (Followings):", data);
				
				if (data && Array.isArray(data.following)) {
					console.log("✅ Gefundene Abonnements:", data.following);
					setFollowings([...data.following]);
				} else {
					console.warn("⚠️ Der Server hat ungültige Daten zurückgegeben oder es gibt keine Abonnements.");
					setFollowings([]);
				}
			} catch (err) {
				console.error("❌ Fehler beim Abrufen der Abonnements:", err.message);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		fetchFollowings();
	}, [token, username]);
	
	// 📌 Benutzerinformationen abrufen
	const fetchUserDetails = async (user) => {
		try {
			const response = await fetch(`http://49.13.31.246:9191/user/${user.username}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok)
				new Error("Fehler beim Laden des Profils");
			
			const data = await response.json();
			setSelectedUser(data);
		} catch (error) {
			console.error("Fehler beim Laden des Profils:", error);
		}
	};
	
	// 📌 Zum Profil weiterleiten
	const handleUserClick = (user) => {
		navigate(`/user/${user.username}`);
		fetchUserDetails(user);
	};
	
	if (loading) return <div className="loading">⏳ Laden...</div>;
	if (error) return <div className="error-msg">{error}</div>;
	
	return (
		<div className="following-list-container">
			<h2>📌 Meine Abonnements</h2>
			<div className="following-list">
				{followings.length > 0 ? (
					followings.map((follow) => (
						<div key={follow._id} className="following-item" onClick={() => handleUserClick(follow)}>
							<img src={follow.avatar || avatar} alt="Avatar" className="following-avatar" />
							<div className="follower-info">
								<h4>{follow.name}</h4>
								<p>@{follow.username}</p>
							</div>
						</div>
					))
				) : (
					<p className="no-followings">Sie folgen niemandem</p>
				)}
			</div>
		</div>
	);
};

export default FolgeIch;

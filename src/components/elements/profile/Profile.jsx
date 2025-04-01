import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {setUser} from "../../../features/features";
import {Link, useNavigate} from "react-router-dom";
import { FcList, FcBusinessman, FcLike, FcCheckmark, FcMoneyTransfer  } from "react-icons/fc";
import "./profile.scss";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png";

const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.user);
	const [profileData, setProfileData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (!token) {
			console.warn("Kein Token zur Authentifizierung gefunden");
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
				dispatch(setUser({
					user: data._id,
					username: data.username,
				}));
			} catch (err) {
				setError(err.message);
				navigate("/");
			} finally {
				setLoading(false);
			}
		};
		
		fetchProfile();
	}, [token, dispatch, navigate]);
	
	// const handleLogout = () => {
	// 	dispatch(logoutUser());
	// 	navigate("/");
	// };
	
	if (!token) return <div className="error-msg">Benutzer ist nicht autorisiert</div>;
	if (loading) return <div className="loading">Laden...</div>;
	if (error) return <div className="error-msg">Fehler: {error}</div>;
	if (!profileData) return <div className="error-msg">Keine Profildaten verfügbar</div>;
	
	return (
		<div className="profile-card col-3">
			<div className="profile-header">
				<Link to="/MyProfile" className="nav-link">
				<img src={profileData.avatar || avatar} alt="Avatar" className="profile-avatar"/>
			</Link>
				<h2>{profileData.fullName}</h2>
				<p className="profile-job">Alter: {profileData.age}</p>
				<p style={{whiteSpace: "pre-wrap"}} className="profile-bio">{profileData.bio}</p>
			</div>
			<div className="profile-stats">
				<div><strong>{profileData.posts_count}</strong> Beiträge</div>
				<div><strong>{profileData.followers}</strong> Folgen</div>
				<div><strong>{profileData.following}</strong> Folge</div>
			</div>
			<div className="profile-menu">
				<button onClick={() => navigate("/myProfile")}><FcBusinessman /> Profil</button>
				<button onClick={() => navigate("/feed")}><FcList /> Übersicht</button>
				<button onClick={() => navigate("/followers")}><FcCheckmark /> Folgen mir</button>
				<button onClick={() => navigate("/followings")}><FcLike /> Folge ich</button>
				<button onClick={() => navigate("/transaktionen")}><FcMoneyTransfer /> Transaktionen</button>
			</div>
			<div className="profile-menu-buttom">
				{/*<button className="logout-btn" onClick={handleLogout}>Abmelden</button>*/}
				<p className="profile-footer">© {new Date().getFullYear()}. Alle Rechte vorbehalten</p>
			</div>
		</div>
	);
};

export default Profile;

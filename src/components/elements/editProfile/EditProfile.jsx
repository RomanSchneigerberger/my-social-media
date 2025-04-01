import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import "./editProfile.scss";
import Nav from "../nav/Nav";

const EditProfile = () => {
	const {token} = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [postData, setPostData] = useState({
		username: "",
		avatar: "",
		age: "",
		bio: "",
		fullName: "",
		balance: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler beim Laden der Daten: ${response.status}`);
				
				const data = await response.json();
				setPostData({
					username: data.username || "",
					avatar: data.avatar || "",
					age: data.age || "",
					bio: data.bio || "",
					fullName: data.fullName || "",
					balance: data.balance || "",
				});
			} catch (err) {
				setError(err.message);
			}
		};
		fetchProfileData();
	}, [token]);
	
	const handleChange = (e) => {
		setPostData({
			...postData,
			[e.target.name]: e.target.value,
		});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("http://49.13.31.246:9191/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify(postData),
			});
			if (!response.ok) {
				throw new Error(`Fehler: ${response.status}`);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
			navigate("/myProfile");
		}
	};
	
	const deleteProfile = async () => {
		const isConfirmed = window.confirm("Sind Sie sicher, dass Sie Ihr Profil löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!");
		
		if (!isConfirmed) return;
		try {
			await fetch("http://49.13.31.246:9191/me", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	};
	
	return (
		<div>
			<Nav/>
			<div className="editProfile">
				<h1>Profil bearbeiten</h1>
				<form onSubmit={handleSubmit} className="edit-profile-form">
					<div className="form-group">
						<button className="delete-profile-btn" onClick={deleteProfile}>
							🗑 Profil löschen
						</button>
						<label htmlFor="username">Benutzername:</label>
						<input
							required
							type="text"
							id="username"
							name="username"
							value={postData.username}
							onChange={handleChange}
							placeholder="Neuen Benutzernamen eingeben"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="age">Alter:</label>
						<input
							required
							type="number"
							id="age"
							name="age"
							value={postData.age}
							onChange={handleChange}
							placeholder="Alter eingeben"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="bio">Über mich:</label>
						<textarea
							required
							type="text"
							id="bio"
							name="bio"
							value={postData.bio}
							onChange={handleChange}
							placeholder="Informationen über sich eingeben"
						></textarea>
					</div>
					<div className="form-group">
						<label htmlFor="fullName">Vollständiger Name:</label>
						<input
							required
							type="text"
							id="fullName"
							name="fullName"
							value={postData.fullName}
							onChange={handleChange}
							placeholder="Vollständigen Namen eingeben"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="balance">Guthaben:</label>
						<input
							type="number"
							id="balance"
							name="balance"
							value={postData.balance}
							onChange={handleChange}
							placeholder="Guthaben eingeben"
						/>
					</div>
					<div className="form-group">
						<label>Avatar:</label>
						<input
							type="text"
							name="avatar"
							value={postData.avatar}
							onChange={handleChange}
							placeholder="URL des Bildes eingeben"
						/>
					</div>
					
					<button className='save_profile' type="submit" disabled={loading}>
						{loading ? "Senden..." : "Änderungen speichern"}
					</button>
					<button className="back-to-profile-btn" onClick={() => navigate("/myProfile")}>Zurück zum Profil
					</button>
				</form>
				
				{error && <div className="error-msg">❌ Fehler: {error}</div>}
			</div>
		</div>
	);
};

export default EditProfile;

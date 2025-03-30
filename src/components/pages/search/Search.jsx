import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import {useSelector} from "react-redux";
import avatar from "../../images/png-transparent-default-avatar-thumbnail.png";
import "./search.scss";
import Nav from "../../elements/nav/Nav";

const Search = () => {
	const [results, setResults] = useState([]);
	const [ setFollowing] = useState(new Set());
	const [loading, setLoading] = useState(false);
	const [error] = useState(null);
	
	const {token, username} = useSelector((state) => state.user);
	const location = useLocation();
	const navigate = useNavigate();
	
	// ✅ Erhalten des query-Parameters aus der URL
	const params = new URLSearchParams(location.search);
	const query = params.get("query")?.toLowerCase() || ""; // Ignoriere Groß- und Kleinschreibung
	
	useEffect(() => {
		if (!token) return;
		const fetchFollowing = async () => {
			try {
				const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
					headers: {"x-access-token": token},
				});
				const followingSet = new Set(response.data.following.map((u) => u.username));
				setFollowing(followingSet);
			} catch (err) {
				console.error("Fehler beim Laden der Abonnements:", err);
			}
		};
		
		fetchFollowing();
	}, [token, username, setFollowing]);
	
	useEffect(() => {
		if (!query) {
			setResults([]);
			return;
		}
		
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`http://49.13.31.246:9191/users`, {
					headers: {"x-access-token": token},
				});
				
				const filteredUsers = response.data.filter((user) =>
					user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
				);
				
				setResults(filteredUsers);
			} catch (err) {
				console.error("Fehler bei der Suche:", err);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [query, token]);
	
	const handleUserClick = (user) => {
		navigate(`/user/${user.username}`);
	};
	
	return (
		<div>
			<Nav/>
			<div className="search-container">
				<h2>🔍 Suchergebnisse: {query}</h2>
				{loading && <p>⏳ Laden...</p>}
				{error && <p className="error-msg">{error}</p>}
				{!loading && results.length === 0 && <p>⚠️ Keine Ergebnisse gefunden</p>}
				<ul className="search-results">
					{results.map((user) => (
						<li key={user._id} onClick={() => handleUserClick(user)}>
							<img src={user.avatar || avatar} alt="Avatar"/>
							{user.fullName} (@{user.username})
						</li>
					))}
				</ul>
				<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
			</div>
		</div>
	);
};

export default Search;

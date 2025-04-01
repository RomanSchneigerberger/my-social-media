import React, {useState} from "react";
import {useSelector} from "react-redux";
import "./newPost.scss";
import { RiVideoAddFill } from "react-icons/ri";
import { MdAddPhotoAlternate } from "react-icons/md";


const NewPost = () => {
	const {token} = useSelector((state) => state.user);
	const [postData, setPostData] = useState({
		title: "",
		description: "",
		image: "",
		video: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showPhotoInput, setShowPhotoInput] = useState(false);
	const [showVideoInput, setShowVideoInput] = useState(false);
	
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
			const response = await fetch("http://49.13.31.246:9191/post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify(postData),
			});
			if (!response.ok) throw new Error(`Fehler: ${response.status}`);
			setPostData({title: "", description: "", image: "", video: ""});
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
		window.location.reload();
	};
	
	return (
		<div className="new-post-container">
			<div className="post-box">
				<h2>Neuer Post</h2>
				<div className="post-header">
					<input
						type="text"
						name="title"
						placeholder="Post Titel..."
						value={postData.title}
						onChange={handleChange}
						className="post-input title-input"
					/>
				</div>
				
				<div className="post-description">
					<textarea
						name="description"
						placeholder="Beschreibung..."
						value={postData.description}
						onChange={handleChange}
						className="post-input desc-input"
					></textarea>
				</div>
				
				<div className="post-actions">
					<button className="post-action photo" onClick={() => setShowPhotoInput(!showPhotoInput)}>
						<MdAddPhotoAlternate />
					</button>
					<button className="post-action video" onClick={() => setShowVideoInput(!showVideoInput)}>
						<RiVideoAddFill />
					</button>
				</div>
				
				{showPhotoInput && (
					<div className="extra-input">
						<input
							type="text"
							name="image"
							placeholder="Foto URL"
							value={postData.image}
							onChange={handleChange}
						/>
					</div>
				)}
				
				{showVideoInput && (
					<div className="extra-input">
						<input
							type="text"
							name="video"
							placeholder="Video URL"
							value={postData.video}
							onChange={handleChange}
						/>
					</div>
				)}
				
				<button className="post-submit" onClick={handleSubmit} disabled={loading}>
					{loading ? "Laden..." : "Veröffentlichen"}
				</button>
				
				{error && <div className="error-msg">Fehler: {error}</div>}
			</div>
		</div>
	);
};

export default NewPost;

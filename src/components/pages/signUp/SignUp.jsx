import React from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import "./signUp.scss";

function SignUp() {
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	let navigate = useNavigate();
	
	const onSubmit = async (data) => {
		try {
			const response = await fetch("http://49.13.31.246:9191/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			
			const result = await response.json();
			
			if (response.ok) {
				console.log("✅ Erfolgreiche Registrierung", result);
				localStorage.setItem("token", result.token);
				navigate(`/`);
			} else {
				console.error("❌ Fehler bei der Registrierung", result);
				alert(result.message || "Registrierungsfehler!");
			}
		} catch (error) {
			console.error("⚠️ Fehler bei der Anfrage", error);
			alert("Fehler bei der Verbindung mit dem Server!");
		}
	};
	
	return (
		<div className="signup-page">
			<form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
				<h2 className="signup-header">Registrierung</h2>
				<p>Haben Sie schon einen Account?</p>
				<button
					type="button"
					className="signup-switch-button"
					onClick={() => navigate("/")}
				>
					Zum Login
				</button>
				<br/>
				<label className="signup-label">
					<span className="signup-label-text">Benutzername</span>
					<input
						className="signup-input"
						{...register("username", {required: "Benutzername ist ein Pflichtfeld", minLength: 4})}
					/>
					{errors.username && (
						<p className="signup-error">{errors.username.message}</p>
					)}
				</label>
				<label className="signup-label">
					<span className="signup-label-text">Passwort</span>
					<input
						type="password"
						className="signup-input"
						{...register("password", {required: "Passwort ist ein Pflichtfeld", minLength: 4})}
					/>
					{errors.password && (
						<p className="signup-error">{errors.password.message}</p>
					)}
				</label>
				<label className="signup-label">
					<span className="signup-label-text">Passwort wiederholen</span>
					<input
						type="password"
						className="signup-input"
						{...register("confirm_password", {
							required: "Passwort bestätigen ist ein Pflichtfeld",
							minLength: 4
						})}
					/>
					{errors.confirm_password && (
						<p className="signup-error">{errors.confirm_password.message}</p>
					)}
				</label>
				<button type="submit" className="signup-button">
					Registrieren
				</button>
				<p className="signup-footer">© {new Date().getFullYear()}. Alle Rechte vorbehalten</p>
			</form>
		</div>
	);
}

export default SignUp;

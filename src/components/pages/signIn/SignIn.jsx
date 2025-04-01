import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../features/features";
import "./signIn.scss";

function SignIn() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	
	const [serverError, setServerError] = useState("");
	
	const onSubmit = async (data) => {
		setServerError(""); // Сброс ошибки
		try {
			const response = await fetch("http://49.13.31.246:9191/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			
			const result = await response.json();
			
			if (response.ok) {
				localStorage.setItem("token", result.token);
				dispatch(setToken({ token: result.token }));
				navigate("/feed");
			} else {
				setServerError(result.message || "Falsche Zugangsdaten");
			}
		} catch (error) {
			console.error("⚠️ Verbindungsfehler:", error);
			setServerError("Serverfehler – bitte später erneut versuchen");
		}
	};
	
	return (
		<div className="signin-page">
			<form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
				<h2 className="signin-header">Anmeldung</h2>
				<p>Sie haben noch keinen Account?</p>
				<button
					className="signin-switch-button"
					type="button"
					onClick={() => navigate("/signUp")}
				>
					Zur Registrierung
				</button>
				
				<label className="signin-label">
					<span className="signin-label-text">Benutzername</span>
					<input
						className="signin-input"
						{...register("username", {
							required: "Bitte geben Sie Ihren Benutzernamen ein",
							minLength: 4,
						})}
					/>
					{errors.username && <p className="signin-error">{errors.username.message}</p>}
				</label>
				
				<label className="signin-label">
					<span className="signin-label-text">Passwort</span>
					<input
						type="password"
						className="signin-input"
						{...register("password", {
							required: "Bitte geben Sie Ihr Passwort ein",
							minLength: 4,
						})}
					/>
					{errors.password && <p className="signin-error">{errors.password.message}</p>}
				</label>
				
				<button type="submit" className="signin-button">
					Anmelden
				</button>
				
				{serverError && <p className="signin-error server-error">{serverError}</p>}
				
				<p className="signup-footer">© {new Date().getFullYear()}. Alle Rechte vorbehalten</p>
			</form>
		</div>
	);
}

export default SignIn;

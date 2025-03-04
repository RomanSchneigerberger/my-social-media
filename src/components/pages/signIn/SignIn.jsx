import React from "react";
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
	const onSubmit = async (data) => {
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
				console.log(" Erfolgreiche Anmeldung:", result);
				localStorage.setItem("token", result.token);
				dispatch(setToken({ token: result.token }));
				navigate("/profile");
			} else {
				console.error(" Anmeldefehler:", result);
				alert(result.message || "Autorisierungsfehler!");
			}
		} catch (error) {
			console.error("⚠️ Anforderungsfehler:", error);
			alert("Fehler beim Verbinden mit dem Server!");
		}
	};
	
	return (
		<div className="signin-page">
			<form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
				<h2 className="signin-header">Login</h2>
				<p>Sie haben noch kein Acount?</p>
				<button className="signin-switch-button" onClick={() => navigate("/signUp")}>
					Zum Registrierung
				</button> <br/>
				<label className="signin-label">
					<span className="signin-label-text">Benutzername</span>
					<input
						className="signin-input"
						{...register("username", { required: "Введите логин", minLength: 4 })}
					/>
					{errors.username && <p className="signin-error">{errors.username.message}</p>}
				</label>
				<label className="signin-label">
					<span className="signin-label-text">Password</span>
					<input
						type="password"
						className="signin-input"
						{...register("password", { required: "Введите пароль", minLength: 4 })}
					/>
					{errors.password && <p className="signin-error">{errors.password.message}</p>}
				</label>
				<button type="submit" className="signin-button">
					Login
				</button>
				<p className="signup-footer">© {new Date().getFullYear()}. All rights reserved</p>
			</form>
		</div>
	);
}

export default SignIn;

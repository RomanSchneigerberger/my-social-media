import React from 'react';
import { useNavigate } from "react-router-dom";
import "../transaktionen/transaktionen.scss";
import Nav from "../../elements/nav/Nav";


const Transaktionen = () => {
	const navigate = useNavigate();
	
	
	return (
		<>
			<Nav />
		<div className="transaktionen">
			<h2>Ich Arbeite an diesen Abschnitt</h2>
			<h3>⚒️</h3>
			<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
		
		</div>
		</>
	);
};

export default Transaktionen;
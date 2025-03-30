import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.scss";

const Weather = () => {
    const [city, setCity] = useState("");
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [backgroundImage, setBackgroundImage] = useState("");
    const API_KEY = "62f9e42b03d163507b0cdb56d144e489";

    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
                );
                const data = response.data;
                setTemperature(data.main.temp);
                setHumidity(data.main.humidity);
                setDescription(data.weather[0].description);
            } catch (error) {
                console.error("Error fetching the weather data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWeatherData();
    }, [city]);

    useEffect(() => {
        const getBackgroundImage = () => {
            if (description.includes("clear")) {
                return "https://cdn.pixabay.com/photo/2018/08/06/22/55/sun-3588618_1280.jpg"; 
            }
            if (description.includes("clouds")) {
                return "https://meinleuchtbild.de/wp-content/uploads/2022/07/clouds-3353159-scaled.jpg";
            }
            if (description.includes("rain")) {
                return "https://static.vecteezy.com/system/resources/previews/042/146/565/non_2x/ai-generated-beautiful-rain-day-view-photo.jpg";
            }
            if (description.includes("thunderstorm")) {
                return "https://media.13newsnow.com/assets/WVEC/images/e23dc125-7f4c-4783-8b28-925ec0d61d6f/e23dc125-7f4c-4783-8b28-925ec0d61d6f_750x422.jpg"
            }
            if (description.includes("snow")) {
                return "https://dg.imgix.net/let-it-snow-gw92kvsv-en/landscape/let-it-snow-gw92kvsv-849cbd4d478faab465556539f22b0805.jpg?ts=1577132675&ixlib=rails-4.3.1&auto=format%2Ccompress&fit=min&w=700&h=394&dpr=2&ch=Width%2CDPR"; // Снег
            }
            if (description.includes("mist") || description.includes("fog")) {
                return "https://images.photowall.com/products/60823/morning-mist-2.jpg?h=699&q=85";
            }
            return "https://masterpiecer-images.s3.yandex.net/669762c2882411ee96cf56181a0358a2:upscaled";
        };
        setBackgroundImage(getBackgroundImage());
    }, [description]);

    return (
        <div
            className="weather-container"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.5s ease",
            }}
        >
            <h1>Weather in {city}</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="city-input"
            />
            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : (
                <div className="weather-info">
                    <p>Temperature: {temperature}°C</p>
                    <p>Humidity: {humidity}%</p>
                    <p>Description: {description}</p>
                </div>
            )}
        </div>
    );
};

export default Weather;

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

//REPLACE THIS WITH YOUR API KEY
const API_KEY = "";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render(__dirname + "/views/index.ejs");
});

app.post("/submit", async (req, res) => {
    let cityName = req.body.city;
    const response = await axios.get(API_URL + `q=${cityName}&appid=${API_KEY}`);
    const data = response.data;
    let visibility = (data.visibility) / 1000;
    let wind = (data.wind.speed) * 3.6;
    let icon = data.weather[0].icon;
    let iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`

    const sendData = {
        city: cityName,
        temperature: data.main.temp,
        weatherDescription: data.weather[0].description,
        highest: data.main.temp_max,
        lowest: data.main.temp_min,
        feelsLike: data.main.feels_like,
        visibility: visibility,
        humidity: data.main.humidity,
        windSpeed: wind.toFixed(2),
        iconURL: iconURL
    };

    res.render(__dirname + "/views/index.ejs", sendData);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


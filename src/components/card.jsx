import React, { useEffect, useState } from "react";
import "./card.css";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze } from "react-icons/wi";
import { IoSearchSharp } from "react-icons/io5";

function Card(props) {
  const [city, setc] = useState("");
  const [name, setname] = useState("Delhi");
  const [info, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherCode, setWeatherCode] = useState("01d");
  let lati;
  let long;

  useEffect(() => {
    // Load default information when the component mounts
    getDefaultWeather();

    setIsLoading(true);
  }, []);

  function getDefaultWeather() {
    const defaultCity = "Delhi";
    setIsLoading(true);
    getcor(defaultCity);
  }

  useEffect(() => {
    console.log("Updated info state:", info);
  }, [info]);

  function onchange(event) {
    setc(event.target.value);
  }

  function clickhandle(event) {
    console.log(city);
    getcor(city);
    setname(city);
    event.preventDefault();
    setc("");
  }

  function getcor(cityname) {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=f818153715b1672a89cff5c1510951e7`
      )
      .then((response) => {
        console.log(response.data);
        // console.log(response.data[0].lat);
        // console.log(response.data[0].lon);
        lati = response.data[0].lat;
        long = response.data[0].lon;
        // setlat(response.data[0].lat);
        // setlon(response.data[0].lon);
        GetWeather(lati, long);
        setIsLoading(false);
      })

      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }
  let code = "";
  function getWeatherIcon(conditionCode) {
    switch (conditionCode) {
      case "01d":
        code = "sunny";
        return <WiDaySunny size={100} />;
      case "02d":
      case "03d":
      case "04d":
        code = "cloudy";
        return <WiCloud size={100} />;
      case "09d":
      case "10d":
        code = "rainy";
        return <WiRain size={100} />;
      case "13d":
        code = "snowy";
        return <WiSnow size={100} />;
      // case "50d":
      //   code = "snowy";
      //   return <WiSnow size={100} />;
      default:
        code = "sunny";
        return <WiDaySunny size={100} />;
    }
  }

  async function GetWeather(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f818153715b1672a89cff5c1510951e7`
      );
      console.log(response.data.main.temp);
      setData(response.data);
      const weatherCode = response.data.weather[0].icon;
      setWeatherCode(weatherCode);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const weatherImages = {
    "01d": "sunny.jpg",
    "02d": "cloudy.jpg",
    "03d": "cloudy.jpg",
    "04d": "cloudy.jpg",
    "09d": "rainy.jpg",
    "10d": "rainy.jpg",
    "13d": "snowy.jpg",
    "50d": "hazy.jpg",
    "04n": "cloudy.jpg",
  };
  function setBackgroundImageUrl(conditionCode) {
    const imageName = weatherImages[conditionCode];
    if (imageName) {
      return process.env.PUBLIC_URL + `/images/${imageName}`;
    }
    return process.env.PUBLIC_URL + `/images/sunny.jpg`; // Return a default image URL if the condition code is not recognized
  }
  const backgroundImageUrl = setBackgroundImageUrl(weatherCode);

  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card custom-bg">
      <div className="component">
        <div className="left-comp ">
          <div className="pic gradient-overlay" style={containerStyle}></div>
          <h1 className="appname">WeatherWiz</h1>
          <div className="lowertext">
            <div>
              {" "}
              <p className="time">{props.time}</p>
              <p className="date">
                {props.day},{props.date} {props.month} {props.year}
              </p>
            </div>

            <div>
              <span className="temp">
                {" "}
                {info && info.main && info.main.temp !== undefined
                  ? Math.floor(info.main.temp - 273) + "°C"
                  : "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="right-comp">
          <div className="top">
            <div className="icon">
              {info.weather &&
                info.weather.length > 0 &&
                getWeatherIcon(info.weather[0].icon)}
            </div>
            <h1>
              {" "}
              {info && info.main && info.main.temp !== undefined
                ? info.weather[0].main
                : "-"}
            </h1>
            <hr></hr>
            <form onSubmit={clickhandle}>
              <div className="field">
                <input
                  onChange={onchange}
                  type="text"
                  value={city}
                  placeholder="Search any city"
                ></input>

                <IoSearchSharp onClick={clickhandle} size={24} />
              </div>
            </form>
          </div>
          <h4>{name}</h4>
          <div className="bottom">
            {" "}
            <div className="chart">
              <div>Feels like</div>
              <div>
                {info && info.main && info.main.temp !== undefined
                  ? Math.floor(info.main.feels_like - 273) + "°C"
                  : "-"}
              </div>
              <div>Humidity</div>
              <div>
                {" "}
                {info && info.main && info.main.temp !== undefined
                  ? info.main.humidity + "%"
                  : "-"}
              </div>
              <div>Wind speed</div>
              <div>
                {info && info.main && info.main.temp !== undefined
                  ? info.wind.speed + "km/h"
                  : "-"}
              </div>
              <div>Visibility</div>
              <div>
                {info && info.main && info.main.temp !== undefined
                  ? info.visibility + "mi"
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Card;

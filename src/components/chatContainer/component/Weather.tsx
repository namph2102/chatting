import { useEffect, useState } from "react";
import { ToastNotify } from "../../../servies/utils";
import { LoadingDot } from "../../loading";

const VITE_WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
interface IWheather {
  app_temp: string;
  wind_spd: string;
  rh: string;
  city_name: string;
  pres: string;
}
const WeatherForecast = () => {
  const [weather, setWeather] = useState<IWheather>({
    app_temp: "",
    wind_spd: "",
    rh: "",
    city_name: "",
    pres: "",
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${VITE_WEATHER_KEY}&include=minutely`
          )
            .then((res) => res.json())
            .then((fullweather) => {
              const dataDetail = fullweather.data[0];
              weather.city_name = dataDetail.city_name;
              weather.app_temp = dataDetail.app_temp;
              weather.rh = dataDetail.rh;
              weather.pres = dataDetail.pres;
              weather.wind_spd = dataDetail.wind_spd;
              setWeather({ ...weather });
            });
        },
        () => {
          ToastNotify("Trình duyệt bạn không hỗ trợ").info();
        }
      );
    }
  }, []);

  return (
    <div>
      {weather.app_temp ? (
        <>
          <ul className="text-sm">
            <li>
              Nhiệt độ {weather.city_name || "đang ở"} hôm nay{" "}
              {weather.app_temp} <sup>0</sup> C
            </li>
            <li> Tốc độ gió : {weather.wind_spd}(m/s)</li>
            <li> Độ ẩm : {weather.rh}%</li>
            <li> Áp suất : {weather.pres} (mb)</li>
          </ul>
        </>
      ) : (
        <LoadingDot />
      )}
    </div>
  );
};

export default WeatherForecast;

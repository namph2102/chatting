import { FC, useEffect, useState } from "react";
import { ToastNotify } from "../../../servies/utils";
import { LoadingDot } from "../../loading";

const VITE_WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
interface IWheather {
  app_temp: string;
  wind_spd: string;
  rh: string;

  pres: string;
}
interface WeatherForecastProps {
  latude: number;
  longtude: number;
}
const initWeather = {
  app_temp: "",
  wind_spd: "",
  rh: "",

  pres: "",
};
const WeatherForecast: FC<WeatherForecastProps> = ({ latude, longtude }) => {
  const [weather, setWeather] = useState<IWheather>(initWeather);
  useEffect(() => {
    if (latude && longtude) {
      handleGetWeather(latude, longtude, setWeather);
      return;
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleGetWeather(
            position.coords.latitude,
            position.coords.longitude,
            setWeather
          );
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
              Nhiệt độ: {weather.app_temp} <sup>0</sup> C
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
const handleGetWeather = async (
  latitude: number,
  longitude: number,
  callback: (info: IWheather) => void
) => {
  fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${VITE_WEATHER_KEY}&include=minutely`
  )
    .then((res) => res.json())
    .then((fullweather) => {
      const weather: IWheather = initWeather;
      const dataDetail = fullweather.data[0];
      weather.app_temp = dataDetail.app_temp;
      weather.rh = dataDetail.rh;
      weather.pres = dataDetail.pres;
      weather.wind_spd = dataDetail.wind_spd;
      callback({ ...weather });
    });
};
export default WeatherForecast;

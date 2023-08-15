import { FC, useEffect, useState } from "react";
import { ToastNotify } from "../../../servies/utils";
import { LoadingDot } from "../../loading";
import { useTranslation } from "react-i18next";
import "../../../servies/translate/contfigTranslate";

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
  const { t } = useTranslation();
  if (weather.app_temp == "null") {
    return (
      <div className="text-red-400 text-sm px-2">
        Xin lỗi không thể do lường!
      </div>
    );
  }
  return (
    <div>
      {weather.app_temp ? (
        <>
          <ul className="text-sm">
            <li>
              {t("temperature")}: {weather.app_temp} <sup>0</sup> C
            </li>
            <li>
              {" "}
              {t("windspeed")}: {weather.wind_spd}(m/s)
            </li>
            <li>
              {" "}
              {t("humidity")} : {weather.rh}%
            </li>
            <li>
              {" "}
              {t("pressure")} : {weather.pres} (mb)
            </li>
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
  const weather: IWheather = initWeather;
  fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${VITE_WEATHER_KEY}&include=minutely`
  )
    .then((res) => res.json())
    .then((fullweather) => {
      const dataDetail = fullweather.data[0];
      weather.app_temp = dataDetail.app_temp;
      weather.rh = dataDetail.rh;
      weather.pres = dataDetail.pres;
      weather.wind_spd = dataDetail.wind_spd;
      callback({ ...weather });
    })
    .catch(() => {
      callback({ ...weather, app_temp: "null" });
    });
};
export default WeatherForecast;

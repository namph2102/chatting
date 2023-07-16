import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Skeleton } from "@mui/material";
import {
  ChoseLocationInMap,
  getCoordinatesFromAddress,
  getLocationName,
} from "./loadmap/index.util";
import { Debounced, ToastNotify } from "../../../servies/utils";
import {
  Coordinates,
  GeolocationError,
  IMarkerLocal,
  IconAdd,
  IconAdmin,
  IconUser,
} from "./loadmap/loadmap.type";
import "../../../servies/translate/contfigTranslate";
import { useTranslation } from "react-i18next";
const LocaltionAdmin = { lat: 10.8508707, lng: 106.6316102 };
interface LoadMapProps {
  search?: string;
  fullname?: string;
  localtion?: string;
  hideSerachInput?: boolean;
}
const LoadMap: React.FC<LoadMapProps> = ({
  search,
  fullname,
  localtion,
  hideSerachInput,
}) => {
  const { t } = useTranslation();

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [localCenter, setLocalCenter] = useState<Coordinates | any>(null);
  const [listMarker, setListMarker] = useState<
    { lat: number; lng: number; title: string; distance: string }[]
  >([]);
  const [isZoomeWidth, setIsZoomeWidth] = useState<boolean>(true);
  const InfomationRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (localtion) {
      try {
        const newLocaltion: { lat: number; log: number } =
          JSON.parse(localtion);
        if (newLocaltion) {
          (async () => {
            const data = {
              latitude: newLocaltion.lat,
              longitude: newLocaltion.log,
            };
            setCoordinates(data);
            setLocalCenter(data);
            const nameAdress = await getLocationName(
              newLocaltion.lat,
              newLocaltion.log
            );
            setLocationName(nameAdress);
          })();
          return;
        }
      } catch {
        ToastNotify(`${t("get")} ${t("location")} ${t("error")}!`).warning();
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: any) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });

          const nameAdress = await getLocationName(latitude, longitude);
          setLocationName(nameAdress);

          //Tìm kiếm theo tên;
          search
            ? await getCoordinatesFromAddress(search, latitude, longitude).then(
                (data: IMarkerLocal[]) => {
                  if (data.length > 0) {
                    setLocalCenter({
                      latitude: data[0].lat,
                      longitude: data[0].lng,
                    });
                    setListMarker([...listMarker, ...data]);
                  }
                }
              )
            : setLocalCenter({ latitude, longitude });
        },
        (error: GeolocationError) => {
          console.error(error);
        }
      );
    } else {
      ToastNotify(`${t("notSupport")}!`).error();
    }
  }, []);

  const getLocaltionClick = async (newMarker: IMarkerLocal) => {
    setListMarker([...listMarker, newMarker]);
  };

  const handleZoomWith = () => {
    setIsZoomeWidth((prev) => {
      if (!InfomationRef.current) return !prev;
      if (prev) {
        InfomationRef.current.textContent =
          "dasd asd sa dsa d sa dsa  dsa  dsa dsasa dsadsa dsadsa";
      } else {
        InfomationRef.current.textContent = "";
      }
      return !prev;
    });
  };
  // add serach
  const inputSerachRef = useRef<HTMLInputElement>(null);
  const handleSerach = async () => {
    if (
      inputSerachRef.current &&
      inputSerachRef.current?.value &&
      localCenter
    ) {
      const contextSearch = inputSerachRef.current.value;
      if (!contextSearch) return;
      await getCoordinatesFromAddress(
        contextSearch,
        localCenter.latitude,
        localCenter.longitude
      ).then((data: IMarkerLocal[]) => {
        if (data?.length > 0) {
          ToastNotify(
            `${t("search")} ${t("success")}: ${contextSearch}`
          ).success();
          setLocalCenter({
            latitude: data[0].lat,
            longitude: data[0].lng,
          });
          setListMarker([...listMarker, ...data]);
        } else {
          ToastNotify(`${t("search")} ${t("error")}: ${contextSearch}`).error();

          if (inputSerachRef.current) {
            inputSerachRef.current.focus();
          }
        }

        if (inputSerachRef.current) {
          inputSerachRef.current.value = "";
        }
      });
    }
  };

  return (
    <div className="w-full fullscreen">
      {localCenter && coordinates && locationName ? (
        <div>
          <p className="w-full text-sm">
            <span className="font-bold capitalize ">
              {t("location")}{" "}
              {fullname?.toLowerCase() == "bạn" ? t("you") : fullname}{" "}
              {t("current")}:{" "}
            </span>{" "}
            ( {t("latitude")} :{coordinates.latitude} , {t("longitude")} :{" "}
            {coordinates.longitude} )
            <span ref={InfomationRef} className="opacity-0 h-2"></span>
          </p>
          <p className="mb-1 text-sm mt-2">
            <span className="font-bold ">{t("address")}:</span> {locationName}
          </p>
          <MapContainer
            center={[localCenter.latitude, localCenter.longitude]}
            zoom={13}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            zoomControl
            className={`w-full ${!isZoomeWidth ? "h-screen" : "h-[400px]"}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              icon={IconUser}
              position={[coordinates.latitude, coordinates.longitude]}
            >
              <Popup>
                {t("indexof")} {fullname || t("you")}
                <br />
              </Popup>
            </Marker>
            {listMarker.length > 0 &&
              listMarker.map((marker, index) => (
                <Marker
                  icon={IconAdd}
                  key={index}
                  position={[marker.lat, marker.lng]}
                >
                  <Popup>
                    {marker.title} <hr className="h-2 mt-1" />
                    {t("separate")}: {marker.distance} km
                    <br />
                  </Popup>
                </Marker>
              ))}
            <Marker icon={IconAdmin} position={LocaltionAdmin}>
              <Popup>
                {t("home")} Zecky.online
                <br />
              </Popup>
            </Marker>
            <Polyline
              positions={[
                { lat: coordinates.latitude, lng: coordinates.longitude },
                { lat: localCenter.latitude, lng: localCenter.longitude },
              ]}
              color="red"
            />
            <ChoseLocationInMap getLocaltionClick={getLocaltionClick} />
          </MapContainer>
          {!hideSerachInput && (
            <div className="flex justify-between  items-center gap-2  mt-2 ">
              <div className="flex sm:items-start flex-col items-center flex-1 gap-1">
                <input
                  ref={inputSerachRef}
                  type="text"
                  className="py-2 px-2 sm:min-w-[200px] min-w-[250px] text-[12px] bg-menu rounded-full  border-[1px] outline-none"
                  placeholder={t("searchPlace")}
                />

                <button
                  onClick={Debounced(handleSerach, 500)}
                  className="py-2 px-4 sm:w-[190px] w-1/2 rounded-xl ml-2 mt-2 opacity-90  hover:opacity-80 background-primary text-sm  "
                >
                  {t("type")} {t("address")}
                </button>
              </div>
              <button
                className="py-2 px-4 bg-[#4f4f73] sm:block hidden  text-xs hover:bg-[#1c1c33] rounded-3xl"
                onClick={handleZoomWith}
              >
                {!isZoomeWidth ? t("zoomOut") : t("zoomIn")}
              </button>
            </div>
          )}
        </div>
      ) : (
        <section>
          <Skeleton
            variant="text"
            animation="wave"
            className="lg:w-[600px] sm:w-[540px] w-80"
            sx={{ fontSize: "1rem" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            className="lg:w-[600px] sm:w-[540px] w-80"
            sx={{ fontSize: "1rem" }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            className="lg:w-[600px] sm:w-[540px] w-80"
            height={320}
          />
        </section>
      )}
    </div>
  );
};

export default LoadMap;

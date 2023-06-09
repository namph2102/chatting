import { useMapEvent, useMapEvents } from "react-leaflet";

import { FC } from "react";
import axios from "axios";
function ClicksetViewMap() {
  const map = useMapEvent("click", () => {
    map.setView([50.5, 30.5], map.getZoom());
  });
  return null;
}
interface ChoseLocationInMapProp {
  getLocaltionClick: (result: {
    lat: number;
    lng: number;
    title: string;
    distance: string;
  }) => void;
}
const ChoseLocationInMap: FC<ChoseLocationInMapProp> = ({
  getLocaltionClick,
}) => {
  let address: IAddress;

  const map = useMapEvents({
    click: async (e) => {
      map.locate();
      const { lat, lng } = e.latlng;
      console.log(`Tọa độ: ${lat}, ${lng}`);
      address = { latitude: lat, longitude: lng };
    },
    locationfound: async (location: any) => {
      const { latitude, longitude } = location;
      console.log("Tọa độ người click:", { latitude, longitude });
      const title = await getLocationName(address.latitude, address.longitude);
      getLocaltionClick({
        lat: address.latitude,
        lng: address.longitude,
        title,
        distance: calculateDistance(
          latitude,
          longitude,
          address.latitude,
          address.longitude
        ),
      });
    },
  });
  return null;
};
interface IAddress {
  latitude: number;
  longitude: number;
}

export { ClicksetViewMap, ChoseLocationInMap };

// lấy tên vị trí
export const getLocationName = async function (
  latitude: number,
  longitude: number
) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    if (response.data.address) {
      const address = response.data.display_name;
      return address;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
// tính khoảng cách cùa 2 vị trí
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadiusKm = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance.toFixed(2);
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export const getLocation = async (search: string) => {
  return await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      search
    )}`
  );
};
// tìm kiếm thông wa chatting;
export const getCoordinatesFromAddress = async (
  search: string,
  latitude: number,
  longitude: number
) => {
  try {
    const response = await getLocation(search);

    if (response.data.length > 0) {
      return response.data.map(
        (item: { lat: string; lon: string; display_name: string }) => {
          const distance = calculateDistance(
            Number(item.lat),
            Number(item.lon),
            latitude,
            longitude
          );
          return {
            lat: Number(item.lat),
            lng: Number(item.lon),
            title: item.display_name,
            distance,
          };
        }
      );
    }
    return [];
  } catch (error) {
    return [];
  }
};

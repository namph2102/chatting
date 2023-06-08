import L from "leaflet";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export const IconUser = new L.Icon({
  iconUrl: "/images/marker.png",
  iconRetinaUrl: "/images/marker.png",
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});
export const IconAdmin = new L.Icon({
  iconUrl: "/images/markeradmin.png",
  iconRetinaUrl: "/images/markeradmin.png",
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});
export const IconAdd = new L.Icon({
  iconUrl: "/images/markerAdd.png",
  iconRetinaUrl: "/images/markerAdd.png",
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});
export interface IMarkerLocal {
  lat: number;
  lng: number;
  title: string;
  distance: string;
}

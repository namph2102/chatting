import axios from "axios";
const domain = window.location.origin || "https://zecky.online/";
const Client_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "d9dc7e067bc94adc812b074ee31f9eb0";
const authorEndPoint = "https://accounts.spotify.com/authorize?";
const redirectUrl = domain + "/callback/spotify";
const scopes = ["user-top-read", "playlist-read-private"];
export const loginEndPoint = `${authorEndPoint}client_id=${Client_ID}&redirect_uri=${redirectUrl}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;
export const appClient = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});

export const setClientToken = (token: string) => {
  appClient.interceptors.request.use(async function (config) {
    (config.headers["Content-Type"] = "application/json"),
      (config.headers.Authorization = "Bearer " + token);
    return config;
  });
};
export const typeSerach = "album";
export const SerachInput = async (value: string) => {
  const res = await appClient.get("search", {
    params: {
      q: value,
      type: typeSerach,
    },
  });
  return res.data;
};
export interface Spotify {
  music: {
    id: string;
    name: string;
    images: { url: string }[];
    uri: string;
    type: string;
  };
  artists: {
    id: string;
    type: string;
    name: string;
    uri: string;
  }[];
}

import axios from "axios";
export const domainserver =
  import.meta.env.VITE_DOMAIN_SEVER ||
  "https://chattingsever-production.up.railway.app/";
const instance = axios.create({
  baseURL: domainserver,
  timeout: 10 * 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("accessToken") || "",
  },
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default instance;

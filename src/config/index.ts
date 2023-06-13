import axios from "axios";
const domainserver =
  import.meta.env.VITE_DOMAIN_SEVER || "https://zeckysever.onrender.com/";
const instance = axios.create({
  baseURL: domainserver,
  timeout: 6 * 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("accessToken") || "",
  },
});

instance.interceptors.request.use(
  (config) => {
    console.log("Trước khi request");
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
instance.interceptors.response.use(
  (response) => {
    console.log("sau khi response");
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default instance;

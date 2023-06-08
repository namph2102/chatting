import axios from "axios";
const domainserver = "http://localhost:3000/";
const instance = axios.create({
  baseURL: domainserver,
  timeout: 3 * 1000,
  headers: { "Content-Type": "application/json" },
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

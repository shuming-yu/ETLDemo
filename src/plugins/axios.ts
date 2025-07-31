import axios from "axios";
// import { useUserAuthStore } from "@/stores/userAuth";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_WebApi_RouteURI,
  withCredentials: true,
});

/**
 * document - https://axios-http.com/docs/interceptors
 * https://stackoverflow.com/questions/70671463/how-to-use-pinia-outside-a-component-in-js-file
 */
axiosApi.interceptors.request.use((config) => {
  // const { AccessToken, StoreLanguage } = useUserAuthStore();

  config.headers["X-RBPC-Application"] = import.meta.env.VITE_Application;
  // config.headers["X-Language"] = StoreLanguage;

  // if (AccessToken) {
  //   config.headers["Authorization"] = `Bearer ${AccessToken}`;
  // }

  return config;
});

export { axiosApi };

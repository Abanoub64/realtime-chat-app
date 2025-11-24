import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://realtime-chat-app-vat5.onrender.com/api",
  withCredentials: true,
});

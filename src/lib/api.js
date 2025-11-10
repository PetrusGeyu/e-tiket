import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://lapakjarubackend.xyz/api",
  timeout: 10000,
});

export default api;

import axios from "axios";

const API_BASE_URL = "https://verifypro-backend.vercel.app"; // ✅ Backend on Vercel
// const API_BASE_URL = "http://localhost:5000"; // Local backend (for testing)

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;

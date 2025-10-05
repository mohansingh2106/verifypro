import axios from "axios";

// ✅ Correct live backend on Vercel
const API_BASE_URL = "https://verifypro-git-main-mohansingh2106s-projects.vercel.app";

// const API_BASE_URL = "http://localhost:5000"; // Local backend (for testing)

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;

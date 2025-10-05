import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server base URL
});

export default API;

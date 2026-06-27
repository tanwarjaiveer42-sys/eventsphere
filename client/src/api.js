import axios from "axios";

const API = axios.create({
  baseURL: "https://eventsphere-ai-nlp8.onrender.com/api",
});

export default API;

// Automatically attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;
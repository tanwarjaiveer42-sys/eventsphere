import API from "../api";

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// REGISTER
export const registerUser = (data) => API.post("/auth/register", data);
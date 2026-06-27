// services/attendanceService.js
import API from "./api";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/**
 * Organizer: scan a QR token
 */
export const scanQRToken = async (qrToken) => {
  const response = await API.post(
    `${API}/attendance/scan`,
    { qrToken },
    getAuthHeader()
  );
  return response.data;
};

/**
 * Organizer: get attendance list for an event
 */
export const getEventAttendance = async (eventId) => {
  const response = await API.get(
    `${API}/attendance/event/${eventId}`,
    getAuthHeader()
  );
  return response.data;
};

/**
 * Student: get my registrations (reuse your existing service or add here)
 */
export const getMyRegistrations = async () => {
  const response = await API.get(`${API}/registrations/my`, getAuthHeader());
  return response.data;
};
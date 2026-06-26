import { useEffect, useState } from "react";
import API from "../services/api";

function MyEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [selectedQR, setSelectedQR] = useState(null);
  const [certError, setCertError] = useState("");

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/registrations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRegistrations(res.data);
    } catch (error) {
      setError("Failed to load your registered events.");
    }
  };

  const downloadCertificate = async (registrationId, studentName) => {
    setCertError("");
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/certificate/${registrationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important — tells Axios to treat response as binary
      });

      // Create a download link from the blob
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${studentName.replace(/\s+/g, "-")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Error response is a blob too, so parse it
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          setCertError(json.message || "Failed to download certificate.");
        } catch {
          setCertError("Failed to download certificate.");
        }
      } else {
        setCertError(
          error.response?.data?.message || "Failed to download certificate."
        );
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        🎟 My Registered Events
      </h1>

      {/* Certificate error banner */}
      {certError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center font-semibold">
          ❌ {certError}
        </div>
      )}

      {registrations.length === 0 ? (
        <h2 className="text-center text-gray-500 text-xl">
          You have not registered for any events yet.
        </h2>
      ) : (
        registrations.map((reg) => (
          <div
            key={reg._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 mb-6 border-l-4 border-blue-500"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-1">
              {reg.eventId?.title || "Event"}
            </h2>

            <p className="text-gray-600 mb-1">
              📅{" "}
              {reg.eventId?.date
                ? new Date(reg.eventId.date).toLocaleDateString()
                : "Date TBA"}
            </p>

            <p className="text-gray-600 mb-1">📍 {reg.eventId?.venue || "Venue TBA"}</p>

            <p className="text-gray-600 mb-3">🏷 {reg.eventId?.category || ""}</p>

            {/* Attendance badge */}
            <div className="mb-4">
              {reg.attended ? (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  ✅ Attended
                </span>
              ) : (
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  🕐 Attendance Pending
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {/* QR Code button — always visible */}
              <button
                onClick={() =>
                  setSelectedQR({ qrCode: reg.qrCode, title: reg.eventId?.title })
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View QR Code
              </button>

              {/* Download Certificate — only if attended */}
              {reg.attended ? (
                <button
                  onClick={() => {
                    setCertError("");
                    downloadCertificate(reg._id, reg.userID?.name || "Student");
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  🏆 Download Certificate
                </button>
              ) : (
                <button
                  disabled
                  title="Attend the event to unlock your certificate"
                  className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                >
                  🔒 Certificate Locked
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* QR Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {selectedQR.title}
            </h2>

            <p className="text-gray-500 text-sm text-center">
              Show this QR code to the organizer for attendance
            </p>

            {selectedQR.qrCode ? (
              <img
                src={selectedQR.qrCode}
                alt="QR Code"
                className="w-56 h-56 rounded-xl border border-gray-200"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                QR not available
              </div>
            )}

            <button
              onClick={() => setSelectedQR(null)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEvents;
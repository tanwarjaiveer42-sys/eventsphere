import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { Scanner } from "@yudiel/react-qr-scanner";

function ScanAttendance() {
  const { eventId } = useParams();

  const [manualToken, setManualToken] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(""); // "success" | "error" | "warn"
  const [registrations, setRegistrations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoadingList(true);
    setListError("");
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/attendance/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRegistrations(res.data.registrations || []);
    } catch (error) {
      if (error.response?.status === 403) {
        setListError("You are not authorized to view attendance for this event.");
      } else {
        setListError("Failed to load attendance list.");
      }
    } finally {
      setLoadingList(false);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();

    if (!manualToken.trim()) return;

    setScanning(true);
    setResult(null);
    setResultType("");

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/attendance/scan",
        { qrToken: manualToken.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
      setResultType("success");
      setManualToken("");
      fetchAttendance();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to verify QR.";
      const alreadyMarked = error.response?.data?.alreadyMarked;

      setResult({ message: msg });
      setResultType(alreadyMarked ? "warn" : "error");
    } finally {
      setScanning(false);
    }
  };

  const attended = registrations.filter((r) => r.attended);

  if (listError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">{listError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
        📷 Scan Attendance
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-gray-700">{registrations.length}</p>
          <p className="text-gray-500 mt-1">Total Registered</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{attended.length}</p>
          <p className="text-gray-500 mt-1">Attended</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-3xl font-bold text-red-500">
            {registrations.length - attended.length}
          </p>
          <p className="text-gray-500 mt-1">Absent</p>
        </div>
      </div>

      {/* Manual Token Entry */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

  <h2 className="text-2xl font-bold mb-4">
    Scan Student QR
  </h2>

  <div className="rounded-xl overflow-hidden mb-6">
    <Scanner
      onScan={(result) => {
        if (result?.[0]) {
          setManualToken(result[0].rawValue);
        }
      }}
      onError={(err) => console.log(err)}
    />
  </div>

  <form onSubmit={handleScan} className="flex gap-3">

    <input
      value={manualToken}
      onChange={(e)=>setManualToken(e.target.value)}
      className="flex-1 border rounded-xl px-4 py-2"
      placeholder="QR token will appear here..."
    />

    <button
      type="submit"
      className="bg-purple-600 text-white px-6 rounded-xl"
    >
      Verify
    </button>

  </form>

</div>

        {/* Result Banner */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-xl font-semibold ${
              resultType === "success"
                ? "bg-green-100 text-green-700"
                : resultType === "warn"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {resultType === "success" ? "✅" : resultType === "warn" ? "⚠️" : "❌"}{" "}
            {result.message}
            {resultType === "success" && result.student && (
              <p className="text-sm mt-1 font-normal">
                {result.student.name} — {result.student.email}
              </p>
            )}
          </div>
        )}
      

      {/* Attendance List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Attendance List</h2>
          <button
            onClick={fetchAttendance}
            className="text-sm text-purple-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loadingList ? (
          <p className="text-center text-gray-400 py-8">Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No registrations yet.</p>
        ) : (
          registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-gray-50 rounded-2xl p-5 mb-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-600">
                  {reg.userID?.name || "Student"}
                </h3>
                <p className="text-gray-500 text-sm">{reg.userID?.email}</p>
              </div>

              <div className="text-right">
                {reg.attended ? (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ✅ Present
                  </span>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-sm font-semibold">
                    Absent
                  </span>
                )}
                {reg.attendedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(reg.attendedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ScanAttendance;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function EventRegistrations() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/registrations/event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setRegistrations(res.data);
    } catch (error) {


      if (error.response?.status === 403) {
        setError("You are not authorized to view registrations for this event.");
      }

    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-10 text-center shadow-xl shadow-violet-200/40 ring-1 ring-white/60 max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl">
            🚫
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 text-center">
          <span className="inline-flex items-center justify-center rounded-2xl bg-violet-100 h-12 w-12 text-2xl mb-3">
            👥
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Event Registrations
          </h1>
          <p className="text-slate-500 mt-1">
            {registrations.length} {registrations.length === 1 ? "person" : "people"} registered
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-12 text-center shadow-lg shadow-violet-200/30 ring-1 ring-white/60">
            <p className="text-slate-400 font-medium">
              No registrations yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="group flex items-center justify-between gap-4 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-200/50"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {reg.userID?.name}
                  </h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {reg.userID?.email}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {reg.userID?.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventRegistrations;
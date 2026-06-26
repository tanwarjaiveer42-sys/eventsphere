import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      
    }
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/registrations/register/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Registered Successfully!");
    } catch (error) {

      alert("Registration Failed");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event Deleted Successfully");
      navigate("/events");

    } catch (error) {


      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <h2 className="text-lg font-semibold text-slate-500">
            Loading event…
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header card */}
        <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl shadow-violet-200/40 ring-1 ring-white/60">
          <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-400" />

          <div className="p-8 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {event?.category && (
                  <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
                    {event.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  {event?.title}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-slate-600 leading-relaxed">
              {event?.description}
            </p>

            {/* Detail grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Date
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {event.date}
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Venue
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {event?.venue}
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Max Participants
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {event.maxParticipants}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-wrap gap-3">
              {user?.role === "Student" && (
                <button
                  onClick={handleRegister}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:shadow-violet-400/60 hover:-translate-y-0.5"
                >
                  Register for Event
                </button>
              )}

              {user?.role === "Organizer" && (
                <Link to={`/registrations/${id}`}>
                  <button className="rounded-xl bg-violet-100 px-6 py-3 font-semibold text-violet-700 transition hover:bg-violet-200">
                    View Registrations
                  </button>
                </Link>
              )}

              {user?.role === "Organizer" && (
                <>
                  <Link to={`/edit-event/${id}`}>
                    <button className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:bg-emerald-600 hover:-translate-y-0.5">
                      Edit Event
                    </button>
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                  >
                    Delete Event
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
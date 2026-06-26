import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function OrganizerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {

    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "Organizer") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("MY EVENTS =", res.data);

        setEvents(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();

  }, [navigate]);



  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">

      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-violet-100 px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          EventSphere <span className="text-violet-600">AI</span>
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-violet-100 text-violet-700 px-4 py-2 text-sm font-semibold transition hover:bg-violet-200"
        >
          Logout
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 sm:px-8 py-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <h2 className="relative text-3xl sm:text-4xl font-bold mb-2">
          Welcome, {user?.name} 👋
        </h2>
        <p className="relative text-lg text-violet-100">
          Organizer Dashboard
        </p>
      </div>

      <div className="px-4 sm:px-8 py-8 sm:py-10">

        {/* Quick Action Buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">

          <Link to="/create-event">
            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 font-semibold shadow-lg shadow-violet-300/40 transition hover:shadow-violet-400/50 hover:-translate-y-0.5">
              Create Event
            </button>
          </Link>

          <Link to="/events">
            <button className="rounded-xl bg-white text-violet-700 px-6 py-3 font-semibold ring-1 ring-violet-200 transition hover:bg-violet-50">
              Manage Events
            </button>
          </Link>

          <Link to="/ai-assistant">
            <button className="rounded-xl bg-white text-indigo-700 px-6 py-3 font-semibold ring-1 ring-indigo-200 transition hover:bg-indigo-50">
              🤖 AI Assistant
            </button>
          </Link>

        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">

          <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Total Events
            </p>
            <h2 className="text-4xl font-bold text-violet-600">
              {events.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Event Status
            </p>
            <h2 className="text-4xl font-bold text-emerald-500">
              Active
            </h2>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Account Type
            </p>
            <h2 className="text-4xl font-bold text-indigo-600">
              Organizer
            </h2>
          </div>

        </div>

        {/* My Events */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            My Events
          </h2>

          {events.length === 0 ? (
            <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-10 text-center ring-1 ring-white/60">
              <p className="text-slate-400 font-medium">
                You haven't created any events yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {event.title}
                  </h3>

                  <p className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>📍 {event.venue}</span>
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        navigate(`/registrations/${event._id}`)
                      }
                      className="rounded-lg bg-violet-600 text-white px-4 py-2 text-sm font-semibold transition hover:bg-violet-700"
                    >
                      View Registrations
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/scan-attendance/${event._id}`)
                      }
                      className="rounded-lg bg-indigo-100 text-indigo-700 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-200"
                    >
                      📷 Scan Attendance
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shortcut cards */}
        <div className="grid md:grid-cols-3 gap-5">

          <Link to="/create-event">
            <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <h3 className="font-bold text-xl mb-2 text-emerald-600">
                ➕ Create Event
              </h3>
              <p className="text-slate-500 text-sm">
                Create and publish new events.
              </p>
            </div>
          </Link>

          <Link to="/events">
            <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <h3 className="font-bold text-xl mb-2 text-violet-600">
                📅 Manage Events
              </h3>
              <p className="text-slate-500 text-sm">
                View, edit and delete your events.
              </p>
            </div>
          </Link>

          <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="font-bold text-xl mb-2 text-indigo-600">
              📊 Dashboard
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Manage all event activities from one place.
            </p>
            <Link to="/organizer-analytics">
              <button className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold transition hover:bg-indigo-700">
                📊 View Analytics
              </button>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OrganizerDashboard;
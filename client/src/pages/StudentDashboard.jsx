import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">

      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-violet-100 px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          EventSphere <span className="text-violet-600">AI</span>
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
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
          Student Dashboard
        </p>
      </div>

      <div className="px-4 sm:px-8 py-8 sm:py-10">

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">

          <Link to="/events">
            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 font-semibold shadow-lg shadow-violet-300/40 transition hover:shadow-violet-400/50 hover:-translate-y-0.5">
              Browse Events
            </button>
          </Link>

          <Link to="/my-events">
            <button className="rounded-xl bg-white text-emerald-700 px-6 py-3 font-semibold ring-1 ring-emerald-200 transition hover:bg-emerald-50">
              My Registered Events
            </button>
          </Link>

        </div>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

          <Link to="/events">
            <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <h3 className="font-bold text-xl mb-2 text-violet-600">
                📅 Browse Events
              </h3>
              <p className="text-slate-500 text-sm">
                Explore upcoming events and register instantly.
              </p>
            </div>
          </Link>

          <Link to="/my-events">
            <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <h3 className="font-bold text-xl mb-2 text-emerald-600">
                🎟 My Events
              </h3>
              <p className="text-slate-500 text-sm">
                View all events you have registered for.
              </p>
            </div>
          </Link>

          <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="font-bold text-xl mb-2 text-indigo-600">
              👤 Profile
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Manage your account and personal information.
            </p>
            <Link to="/student-analytics">
              <button className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold transition hover:bg-indigo-700">
                📊 My Analytics
              </button>
            </Link>
          </div>

          <Link to="/ai-assistant">
            <div className="h-full rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-md shadow-violet-100/50 ring-1 ring-white/60 transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">
              <h3 className="font-bold text-xl mb-2 text-violet-600">
                🤖 AI Assistant
              </h3>
              <p className="text-slate-500 text-sm">
                Get help and quick answers about your events.
              </p>
            </div>
          </Link>

        </div>
      </div>


    </div>
  );


}

export default StudentDashboard;
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

  <div className="min-h-screen bg-gray-100">


{/* Navbar */}
<div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
  <h1 className="text-3xl font-bold">
    EventSphere AI
  </h1>

  <button
    onClick={handleLogout}
    className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
  >
    Logout
  </button>
</div>

{/* Hero Section */}
<div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-10">
  <h2 className="text-4xl font-bold mb-2">
    Welcome, {user?.name} 👋
  </h2>

  <p className="text-lg opacity-90">
    Organizer Dashboard
  </p>
</div>

<div className="p-8">

  {/* Quick Action Buttons */}
  <div className="flex gap-4 mb-8 flex-wrap">

    <Link to="/create-event">
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
        Create Event
      </button>
    </Link>

    <Link to="/events">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
        Manage Events
      </button>
    </Link>

  </div>
  <div className="grid md:grid-cols-3 gap-6 mb-8">

  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-4xl font-bold text-blue-600">
      {events.length}
    </h2>
    <p>Total Events</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-4xl font-bold text-green-600">
      Active
    </h2>
    <p>Event Status</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="text-4xl font-bold text-purple-600">
      Organizer
    </h2>
    <p>Account Type</p>
  </div>
 <Link to="/ai-assistant">
  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
    🤖 AI Assistant
  </button>
</Link>
</div>

  {/* Dashboard Cards */}
  {/* My Events */}
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-6">My Events</h2>

  <div className="grid md:grid-cols-2 gap-6">
    {events.map((event) => (
      <div
        key={event._id}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h3 className="text-xl font-bold">
          {event.title}
        </h3>

        <p className="text-gray-600 mt-2">
          {event.description}
        </p>

        <p className="mt-3">
          📍 {event.venue}
        </p>

        <p>
          📅 {new Date(event.date).toLocaleDateString()}
        </p>

        <div className="flex gap-3 mt-5">

          <button
            onClick={() =>
              navigate(`/registrations/${event._id}`)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Registrations
          </button>

          <button
            onClick={() =>
              navigate(`/scan-attendance/${event._id}`)
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            📷 Scan Attendance
          </button>

        </div>

      </div>
    ))}
  </div>
</div>
  <div className="grid md:grid-cols-3 gap-6">

    <Link to="/create-event">
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer">
        <h3 className="font-bold text-2xl mb-3 text-green-600">
          ➕ Create Event
        </h3>

        <p className="text-gray-600">
          Create and publish new events.
        </p>
      </div>
    </Link>

    <Link to="/events">
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer">
        <h3 className="font-bold text-2xl mb-3 text-blue-600">
          📅 Manage Events
        </h3>

        <p className="text-gray-600">
          View, edit and delete your events.
        </p>
      </div>
    </Link>

    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
      <h3 className="font-bold text-2xl mb-3 text-purple-600">
        📊 Dashboard
      </h3><Link to="/organizer-analytics">
    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
        📊 View Analytics
    </button>
</Link>

      <p className="text-gray-600">
        Manage all event activities from one place.
      </p>
    </div>

  </div>

</div>


  </div>
);

}

export default OrganizerDashboard;
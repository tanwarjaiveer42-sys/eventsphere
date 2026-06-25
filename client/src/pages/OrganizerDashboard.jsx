import { Link, useNavigate } from "react-router-dom";

function OrganizerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Organizer Dashboard
      </h1>

      <div className="flex gap-4 flex-wrap">

        <Link to="/create-event">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create Event
          </button>
        </Link>

        <Link to="/events">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            View Events
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default OrganizerDashboard;
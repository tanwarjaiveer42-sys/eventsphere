import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
     
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        All Events
      </h1>

     {events.length === 0 ? (
  <h2 className="text-center text-gray-500 text-xl">
    No Events Available
  </h2>
) : (
  <>
    <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
      Available Events
    </h1>

    {events.map((event) => (
      <div
        key={event._id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition duration-300 p-6 mb-6 border-l-4 border-blue-500"
      >
        <Link to={`/events/${event._id}`}>
          <h2 className="text-2xl font-bold text-blue-600 mb-2 hover:underline">
            {event.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-3">
          {event.description}
        </p>

        <p className="mb-1">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>

        <p className="mb-1">
          📍 {event.venue}
        </p>

        <p className="mb-3">
          🏷 {event.category}
        </p>
      </div>
    ))}
  </>
)}
    </div>
  );
}

export default Events;
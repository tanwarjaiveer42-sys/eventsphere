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
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        All Events
      </h1>

      {events.map((event) => (
        <div
          key={event._id}
          className="border p-4 rounded-lg mb-4"
        >
          <Link to={`/events/${event._id}`}>
          <h2 className="text-xl font-bold text-blue-600 hover:underline">
           {event.title}
          </h2>
           </Link>

          <p>{event.description}</p>

          <p>Date: {event.date}</p>
        </div>
      ))}
    </div>
  );
}

export default Events;
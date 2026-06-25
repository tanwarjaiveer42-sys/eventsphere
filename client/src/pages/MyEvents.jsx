import { useEffect, useState } from "react";
import API from "../services/api";

function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/registrations/my-events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Registered Events
      </h1>

      {events.map((item) => (
        <div
          key={item._id}
          className="border p-4 rounded mb-4"
        >
          <h2 className="text-xl font-bold">
            {item.eventId.title}
          </h2>

          <p>{item.eventId.description}</p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              item.eventId.date
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Venue:</strong>{" "}
            {item.eventId.venue}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {item.eventId.category}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyEvents;
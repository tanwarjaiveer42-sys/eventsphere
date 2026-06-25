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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
  My Registered Events
</h1><div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-2xl shadow-lg mb-8">
  <h2 className="text-2xl font-bold">
    Your Event Registrations
  </h2>

  <p className="opacity-90 mt-2">
    View all events you have successfully registered for.
  </p>
</div>

     {events.length === 0 ? (
  <h2 className="text-center text-gray-500 text-xl">
    You have not registered for any events yet.
  </h2>
) : (
  events.map((item) => (
    <div
      key={item._id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition duration-300 p-6 mb-6 border-l-4 border-green-500"
    >
      <h2 className="text-2xl font-bold text-green-600 mb-2">
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
  ))
)}
    </div>
  );
}

export default MyEvents;
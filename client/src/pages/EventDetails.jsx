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
      console.log(error);
    }
  };const handleRegister = async () => {
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
  console.log(error);
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
    console.log(error);
    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Delete Failed"
    );
  }
};
  if (!event) {
    return <h2 className="p-8">Loading...</h2>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        {event.title}
      </h1>

      <p className="mb-3">
        <strong>Description:</strong> {event.description}
      </p>

      <p className="mb-3">
        <strong>Date:</strong> {event.date}
      </p>

      <p className="mb-3">
        <strong>Venue:</strong> {event.venue}
      </p>

      <p className="mb-3">
        <strong>Category:</strong> {event.category}
      </p>

      <p className="mb-3">
        <strong>Max Participants:</strong> {event.maxParticipants}
      </p>
     <div className="mt-6">

  {user?.role === "Student" && (
    <button
      onClick={handleRegister}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Register Event
    </button>
  )}

  {user?.role === "Organizer" && (
    <>
      <Link to={`/edit-event/${id}`}>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mr-3"
        >
          Edit Event
        </button>
      </Link>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Event
      </button>
    </>
  )}

</div>
  </div>
  );
}


export default EventDetails;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function EventRegistrations() {
  const { id } = useParams();
const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/registrations/event/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Registrations:", res.data);
setRegistrations(res.data);
    } catch (error) {
  console.log(error);

  if (error.response?.status === 403) {
    setError("You are not authorized to view registrations for this event.");
  }

    }
  };
     if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>

        <p className="text-gray-600">
          You are not authorized to view registrations for this event.
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
  👥 Event Registrations
</h1>
   {error && (
  <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center font-semibold">
    🚫 {error}
  </div>
)}
      {registrations.map((reg) => (
  <div
    key={reg._id}
    className="bg-white p-6 rounded-2xl shadow-lg mb-4"
  >
    <h2 className="text-2xl font-bold text-blue-600">
      {reg.userId.name}
    </h2>

    <p className="text-gray-600">
      {reg.userId.email}
    </p>

    <p className="text-sm text-gray-500 mt-2">
      Role: {reg.userId.role}
    </p>
    
  </div>
))}
    </div>
  );
}

export default EventRegistrations;
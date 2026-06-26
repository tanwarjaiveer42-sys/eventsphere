import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);

      setTitle(res.data.title);
      setDescription(res.data.description);
      setDate(res.data.date.split("T")[0]);
      setVenue(res.data.venue);
      setCategory(res.data.category);
      setMaxParticipants(res.data.maxParticipants);
    } catch (error) {
      
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/events/update/${id}`,
        {
          title,
          description,
          date,
          venue,
          category,
          maxParticipants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event Updated Successfully");

      navigate(`/events/${id}`);
    } catch (error) {
 

  alert(
    error.response?.data?.message ||
    "Update Failed"
  );
}
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Event
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Venue"
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <input
          type="number"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          placeholder="Max Participants"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Event
        </button>

      </form>
    </div>
  );
}

export default EditEvent;
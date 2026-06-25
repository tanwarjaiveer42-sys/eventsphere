import { useState } from "react";
import API from "../services/api";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/events/create",
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

      alert("Event Created Successfully!");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
  Create New Event
</h1><div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <input
          type="number"
          placeholder="Max Participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <button type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
          Create Event
          
        </button>
      </form>
      </div>
    </div>
  );
}

export default CreateEvent;
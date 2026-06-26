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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-xl">

        <div className="overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl shadow-violet-200/40 ring-1 ring-white/60">
          <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-400" />

          <div className="p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
              Edit Event
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Update the details below and save your changes.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Venue"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="e.g. 100"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:shadow-violet-400/60 hover:-translate-y-0.5 mt-2"
              >
                Update Event
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
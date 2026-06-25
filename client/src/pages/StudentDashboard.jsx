import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "Student") {
      navigate("/login");
    }
  }, []);

  return (

  <div className="min-h-screen bg-gray-100">

```
{/* Navbar */}
<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
  <h1 className="text-3xl font-bold">
    EventSphere AI
  </h1>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }}
    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
  >
    Logout
  </button>
</div>

{/* Hero Section */}
<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-10">
  <h2 className="text-4xl font-bold mb-2">
    Welcome, {user?.name} 👋
  </h2>

  <p className="text-lg opacity-90">
    Student Dashboard
  </p>
</div>

<div className="p-8">

  {/* Action Buttons */}
  <div className="flex gap-4 mb-8 flex-wrap">

    <Link to="/events">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
        Browse Events
      </button>
    </Link>

    <Link to="/my-events">
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
        My Registered Events
      </button>
    </Link>

  </div>

  {/* Dashboard Cards */}
  <div className="grid md:grid-cols-3 gap-6">

    <Link to="/events">
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer">
    <h3 className="font-bold text-2xl mb-3 text-blue-600">
      📅 Browse Events
    </h3>

    <p className="text-gray-600">
      Explore upcoming events and register instantly.
    </p>
  </div>
</Link>
   <Link to="/my-events">
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer">
    <h3 className="font-bold text-2xl mb-3 text-green-600">
      🎟 My Events
    </h3>

    <p className="text-gray-600">
      View all events you have registered for.
    </p>
  </div>
</Link>

    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
      <h3 className="font-bold text-2xl mb-3 text-purple-600">
        👤 Profile
      </h3>

      <p className="text-gray-600">
        Manage your account and personal information.
      </p>
    </div>

  </div>
</div>
```

  </div>
);

  
}

export default StudentDashboard;
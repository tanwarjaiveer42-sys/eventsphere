function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">EventSphere AI</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">
          Welcome, {user?.name} 👋
        </h2>

        <p className="text-gray-600 mb-8">
          Role: {user?.role}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">My Events</h3>
            <p>View all registered events.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Certificates</h3>
            <p>Download event certificates.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">Profile</h3>
            <p>Manage your account settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
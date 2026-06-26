import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import MyEvents from "./pages/MyEvents";
import EventRegistrations from "./pages/EventRegistrations";
import ScanAttendance from "./pages/organizer/ScanAttendance";
import AIAssistant from "./pages/AIAssistant";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import StudentAnalytics from "./pages/StudentAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Organizer */}
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path="/registrations/:id" element={<EventRegistrations />} />
        <Route
          path="/scan-attendance/:eventId"
          element={
            <ProtectedRoute>
              <ScanAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-dashboard"
          element={
            <ProtectedRoute>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-analytics"
          element={
            <ProtectedRoute>
              <OrganizerAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route path="/my-events" element={<MyEvents />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-analytics"
          element={
            <ProtectedRoute>
              <StudentAnalytics />
            </ProtectedRoute>
          }
        />

        {/* AI */}
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Other */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
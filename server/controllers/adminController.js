// controllers/adminController.js
const User = require("../models/user");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/stats
// Returns platform-wide counts for the overview cards
// ─────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalEvents, totalRegistrations, totalAttendance] =
            await Promise.all([
                User.countDocuments(),
                Event.countDocuments(),
                Registration.countDocuments(),
                Registration.countDocuments({ attended: true }),
            ]);

        res.json({
            totalUsers,
            totalEvents,
            totalRegistrations,
            totalAttendance,
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/users
// Returns all users. Supports ?search= query param.
// ─────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;

        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error("Admin get users error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/admin/users/:id
// Deletes a user and all their registrations
// ─────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (id === (req.user.id || req.user._id).toString()) {
            return res.status(400).json({
                message: "You cannot delete your own admin account.",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Clean up registrations belonging to this user
        await Registration.deleteMany({ userID: id });

        await User.findByIdAndDelete(id);

        res.json({ message: `User "${user.name}" deleted successfully.` });
    } catch (error) {
        console.error("Admin delete user error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/events
// Returns all events with organizer info populated
// ─────────────────────────────────────────────────────────────────
const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json(events);
    } catch (error) {
        console.error("Admin get events error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// DELETE /api/admin/events/:id
// Deletes an event and all its registrations
// ─────────────────────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Clean up all registrations for this event
        await Registration.deleteMany({ eventId: id });

        await Event.findByIdAndDelete(id);

        res.json({ message: `Event "${event.title}" deleted successfully.` });
    } catch (error) {
        console.error("Admin delete event error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/admin/events/:id/registrations
// Returns all registrations for a specific event (admin view)
// ─────────────────────────────────────────────────────────────────
const getEventRegistrations = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        const registrations = await Registration.find({ eventId: id })
            .populate("userID", "name email role")
            .sort({ createdAt: -1 });

        res.json({ event: event.title, registrations });
    } catch (error) {
        console.error("Admin get registrations error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = {
    getStats,
    getUsers,
    deleteUser,
    getEvents,
    deleteEvent,
    getEventRegistrations,
};
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// POST /api/attendance/scan
const scanAttendance = async (req, res) => {
    try {
        const { qrToken } = req.body;
        const organizerId = req.user.id || req.user._id;

        if (!qrToken) {
            return res.status(400).json({ message: "QR token is required." });
        }

        const registration = await Registration.findOne({ qrToken }).populate("eventId");

        if (!registration) {
            return res.status(404).json({ message: "Invalid QR code. Registration not found." });
        }

        if (!registration.eventId) {
            return res.status(404).json({ message: "Event linked to this QR no longer exists." });
        }

        if (registration.eventId.createdBy.toString() !== organizerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized. You can only mark attendance for your own events.",
            });
        }

        if (registration.attended) {
            return res.status(409).json({
                message: `Attendance already marked on ${new Date(registration.attendedAt).toLocaleString()}.`,
                alreadyMarked: true,
            });
        }

        registration.attended = true;
        registration.attendedAt = new Date();
        await registration.save();

        await registration.populate("userID", "name email");

        return res.status(200).json({
            message: "Attendance marked successfully!",
            student: {
                name: registration.userID.name,
                email: registration.userID.email,
            },
            event: registration.eventId.title,
            attendedAt: registration.attendedAt,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// GET /api/attendance/event/:eventId
const getEventAttendance = async (req, res) => {
    try {
        const { eventId } = req.params;
        const organizerId = req.user.id || req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        if (event.createdBy.toString() !== organizerId.toString()) {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const registrations = await Registration.find({ eventId })
            .populate("userID", "name email")
            .sort({ attended: -1, createdAt: 1 });

        return res.status(200).json({ registrations });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { scanAttendance, getEventAttendance };
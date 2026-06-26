const Registration = require("../models/Registration");
const Event = require("../models/Event");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// POST /api/registrations/register/:eventId
exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId || req.params.id;
        const userID = req.user.id || req.user._id;

        // Check event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Prevent duplicate registration
        const existing = await Registration.findOne({ eventId, userID });
        if (existing) {
            return res.status(400).json({ message: "Already registered for this event." });
        }

        // Generate unique QR token
        const qrToken = uuidv4();

        // Generate QR code as Base64 Data URL
        const qrCode = await QRCode.toDataURL(qrToken, {
            width: 300,
            margin: 2,
            color: { dark: "#1e293b", light: "#ffffff" },
        });

        const registration = await Registration.create({
            eventId,
            userID,
            qrToken,
            qrCode,
        });

        res.status(201).json({
            message: "Registered successfully.",
            registration,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// GET /api/registrations/my — Student's own registrations
exports.getMyRegistrations = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id;

        const registrations = await Registration.find({ userID }).populate("eventId");

        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/registrations/event/:id — Organizer views registrations for their event
exports.getEventRegistrations = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userId = req.user.id || req.user._id;

        if (event.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        const registrations = await Registration.find({
            eventId: req.params.id,
        }).populate("userID", "name email role");

        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
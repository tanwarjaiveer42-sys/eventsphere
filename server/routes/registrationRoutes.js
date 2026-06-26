const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    registerForEvent,
    getMyRegistrations,
    getEventRegistrations,
} = require("../controllers/registrationController");

// Student registers for an event
router.post("/register/:eventId", protect, registerForEvent);

// Student views their own registrations (with QR codes)
router.get("/my", protect, getMyRegistrations);

// Organizer views registrations for their event
router.get("/event/:id", protect, getEventRegistrations);

module.exports = router;
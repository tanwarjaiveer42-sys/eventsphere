const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
} = require("../controllers/eventController");

router.post("/create", protect, (req, res, next) => {
    if (req.user.role !== "Organizer") {
        return res.status(403).json({
            message: "Only organizers can create events"
        });
    }
    next();
}, createEvent);

router.get("/", getEvents);

router.get("/my-events", protect, getMyEvents);

router.get("/:id", getEventById);

router.put("/update/:id", protect, updateEvent);

router.delete("/delete/:id", protect, deleteEvent);

module.exports = router;
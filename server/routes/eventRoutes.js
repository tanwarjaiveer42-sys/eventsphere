const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.post("/create", protect, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.put("/update/:id", protect, updateEvent);
router.delete("/delete/:id", protect, deleteEvent);

module.exports = router;
const express = require("express");
const router = express.Router();

const { scanAttendance, getEventAttendance } = require("../controllers/attendanceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/scan", protect, authorizeRoles("Organizer"), scanAttendance);

router.get("/event/:eventId", protect, authorizeRoles("Organizer"), getEventAttendance);

module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getOrganizerAnalytics,
    getStudentAnalytics,
} = require("../controllers/analyticsController");

router.get("/organizer", protect, getOrganizerAnalytics);
router.get("/student", protect, getStudentAnalytics);

module.exports = router;
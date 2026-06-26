const express = require("express");
const router = express.Router();
const { generateCertificate } = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/certificate/:registrationId
router.get("/:registrationId", protect, generateCertificate);

module.exports = router;
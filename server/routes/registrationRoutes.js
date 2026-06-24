const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  registerEvent,
} = require("../controllers/registrationController");

router.post(
  "/register/:eventId",
  protect,
  registerEvent
);

module.exports = router;
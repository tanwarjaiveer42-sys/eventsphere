console.log("REGISTRATION ROUTES LOADED");
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  registerEvent,
  getMyEvents,
} = require("../controllers/registrationController");

router.post(
  "/register/:eventId",
  protect,
  registerEvent
);

router.get(
  "/my-events",
  protect,
  getMyEvents
);

module.exports = router;
console.log("REGISTRATION ROUTES LOADED");
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  registerEvent,
  getMyEvents,
  getEventRegistrations,
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
router.get(
  "/event/:eventId",
  protect,
  getEventRegistrations
);
router.get("/test", (req, res) => {
  res.send("Registration route working");
});
module.exports = router;
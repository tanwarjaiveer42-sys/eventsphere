// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
    getStats,
    getUsers,
    deleteUser,
    getEvents,
    deleteEvent,
    getEventRegistrations,
} = require("../controllers/adminController");

// Every admin route requires a valid JWT AND the "Admin" role
const adminGuard = [protect, authorizeRoles("Admin")];

router.get("/stats",                        adminGuard, getStats);
router.get("/users",                        adminGuard, getUsers);
router.delete("/users/:id",                 adminGuard, deleteUser);
router.get("/events",                       adminGuard, getEvents);
router.delete("/events/:id",               adminGuard, deleteEvent);
router.get("/events/:id/registrations",    adminGuard, getEventRegistrations);

module.exports = router;
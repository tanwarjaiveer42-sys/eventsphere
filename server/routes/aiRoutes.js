const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    chat,
    generateDescription,
    budgetSuggestions,
    promotionIdeas,
    eventPlan,
} = require("../controllers/aiController");

// All AI routes require authentication
router.post("/chat", protect, chat);
router.post("/generate-description", protect, generateDescription);
router.post("/budget-suggestions", protect, budgetSuggestions);
router.post("/promotion-ideas", protect, promotionIdeas);
router.post("/event-plan", protect, eventPlan);

module.exports = router;
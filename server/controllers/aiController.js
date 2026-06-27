const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System context injected into every request so Gemini knows the product
const SYSTEM_CONTEXT = `You are EventSphere AI Assistant — a smart, helpful AI built into EventSphere, a college event management platform. 

Your capabilities:
- Help organizers plan events (themes, schedules, logistics)
- Generate compelling event descriptions
- Suggest realistic budgets for college events
- Create promotion strategies for student events
- Answer student FAQs about events and registrations
- Provide actionable, specific advice

Rules:
- Keep answers concise, practical, and college-context appropriate
- Use bullet points and structure for clarity
- Always be encouraging and professional
- If asked something unrelated to events or college life, gently redirect
- Format responses with markdown for better readability`;

// Small helper to keep the generateContent call shape consistent everywhere
const generate = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
};

// POST /api/ai/chat  — General AI Chat
const chat = async (req, res) => {
    try {

        const { message } = req.body;

        const prompt = `
${SYSTEM_CONTEXT}

User Question:
${message}
`;

        const text = await generate(prompt);

        res.json({
            reply: text,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });

    }
};

// POST /api/ai/generate-description  — Event Description Generator
const generateDescription = async (req, res) => {
    try {
        const { title, category, date, venue, maxParticipants } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Event title is required." });
        }

        const prompt = `${SYSTEM_CONTEXT}

Generate a compelling, engaging event description for a college event with these details:
- Title: ${title}
- Category: ${category || "General"}
- Date: ${date || "TBA"}
- Venue: ${venue || "College Campus"}
- Max Participants: ${maxParticipants || "Open"}

Write a 3-4 paragraph description that:
1. Opens with an exciting hook
2. Explains what attendees will experience
3. Highlights the value and learning outcomes
4. Ends with a call to action

Keep it energetic, student-friendly, and under 250 words.`;

        const text = await generate(prompt);

        res.json({ description: text });
    } catch (error) {
        console.error("Description generation error:", error);
        res.status(500).json({
            message: "Failed to generate description. Please try again.",
            error: error.message,
        });
    }
};

// POST /api/ai/budget-suggestions  — Budget Planner
const budgetSuggestions = async (req, res) => {
    try {
        const { eventType, participants, duration } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: "Event type is required." });
        }

        const prompt = `${SYSTEM_CONTEXT}

Create a detailed budget breakdown for this college event:
- Event Type: ${eventType}
- Expected Participants: ${participants || 100}
- Duration: ${duration || "1 day"}

Provide:
1. Itemized budget table with estimated costs in INR
2. Cost-saving tips specific to college events
3. Sponsorship suggestions
4. A total estimated range (minimum and recommended)

Be realistic for a college budget. Format with clear sections and a summary table.`;

        const text = await generate(prompt);

        res.json({ budget: text });
    } catch (error) {
        console.error("Budget suggestion error:", error);
        res.status(500).json({
            message: "Failed to generate budget suggestions.",
            error: error.message,
        });
    }
};

// POST /api/ai/promotion-ideas  — Promotion Strategy Generator
const promotionIdeas = async (req, res) => {
    try {
        const { eventTitle, targetAudience, eventDate } = req.body;

        if (!eventTitle) {
            return res.status(400).json({ message: "Event title is required." });
        }

        const prompt = `${SYSTEM_CONTEXT}

Generate a complete promotion strategy for this college event:
- Event: ${eventTitle}
- Target Audience: ${targetAudience || "College students"}
- Event Date: ${eventDate || "upcoming"}

Provide:
1. Social media strategy (Instagram, WhatsApp, LinkedIn posts with sample captions)
2. On-campus promotion ideas
3. Email/announcement templates
4. A week-by-week promotion timeline
5. Engagement ideas to boost registrations

Make it practical, creative, and specifically tailored for a college audience.`;

        const text = await generate(prompt);

        res.json({ ideas: text });
    } catch (error) {
        console.error("Promotion ideas error:", error);
        res.status(500).json({
            message: "Failed to generate promotion ideas.",
            error: error.message,
        });
    }
};

// POST /api/ai/event-plan  — Full Event Planning
const eventPlan = async (req, res) => {
    try {
        const { eventType, theme, participants, duration } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: "Event type is required." });
        }

        const prompt = `${SYSTEM_CONTEXT}

Create a comprehensive event plan for:
- Event Type: ${eventType}
- Theme: ${theme || "Open"}
- Expected Participants: ${participants || 100}
- Duration: ${duration || "1 day"}

Include:
1. Pre-event checklist (2 weeks before)
2. Hour-by-hour schedule on the day
3. Required team roles and responsibilities
4. Equipment and logistics checklist
5. Risk management tips
6. Post-event follow-up steps

Be detailed and actionable for a college organizing committee.`;

        const text = await generate(prompt);

        res.json({ plan: text });
    } catch (error) {
        console.error("Event plan error:", error);
        res.status(500).json({
            message: "Failed to generate event plan.",
            error: error.message,
        });
    }
};

module.exports = {
    chat,
    generateDescription,
    budgetSuggestions,
    promotionIdeas,
    eventPlan,
};
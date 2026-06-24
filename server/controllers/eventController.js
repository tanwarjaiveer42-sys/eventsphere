const Event = require("../models/Event");

// CREATE EVENT
exports.createEvent = async (req, res) => {
    console.log("REQ.USER =", req.user);

    try {
        const event = await Event.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL EVENTS
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

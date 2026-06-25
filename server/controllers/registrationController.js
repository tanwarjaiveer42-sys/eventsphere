const Registration = require("../models/Registration");

exports.registerEvent = async (req, res) => {
  try {
    const existing = await Registration.findOne({
  userId: req.user.id,
  eventId: req.params.eventId,
});

if (existing) {
  return res.status(400).json({
    message: "Already registered",
  });
}
    const registration = await Registration.create({
      userId: req.user.id,
      eventId: req.params.eventId,
    });

    res.status(201).json({
      message: "Registered Successfully",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user.id,
    }).populate("eventId");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};